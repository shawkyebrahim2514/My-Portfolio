// A seamless, auto-scrolling horizontal marquee. Ported from React Bits'
// LogoLoop (rAF-driven translate3d track, resize/image-load aware copy
// count) and trimmed down: this project only ever needs a horizontal loop of
// custom items (contact pills via a required renderItem), so the vertical
// direction, default img/anchor rendering, and node-vs-src item union from
// the original have been dropped.
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { Key, ReactNode, RefObject } from 'react';
import { useReducedMotion } from '@react-spring/web';
import { cx } from '../../utils/cx';
import styles from './LogoLoop.module.css';

const MIN_COPIES = 2;
const COPY_HEADROOM = 2;
const SMOOTH_TAU = 0.25;

export type LogoLoopItem = {
    readonly src: string;
    readonly alt: string;
    readonly href: string;
};

type LogoLoopProps = {
    readonly items: readonly LogoLoopItem[];
    readonly renderItem: (item: LogoLoopItem, key: Key) => ReactNode;
    readonly speed?: number;
    readonly gap?: number;
    readonly pauseOnHover?: boolean;
    readonly fadeOut?: boolean;
    readonly ariaLabel?: string;
};

function useResizeObserver(callback: () => void, elements: Array<RefObject<Element | null>>, deps: unknown[]) {
    useEffect(() => {
        if (!window.ResizeObserver) {
            window.addEventListener('resize', callback);
            callback();
            return () => window.removeEventListener('resize', callback);
        }
        const observers = elements.map((ref) => {
            if (!ref.current) return null;
            const observer = new ResizeObserver(callback);
            observer.observe(ref.current);
            return observer;
        });
        callback();
        return () => observers.forEach((observer) => observer?.disconnect());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

function useAnimationLoop(
    trackRef: RefObject<HTMLDivElement | null>,
    targetVelocity: number,
    seqWidth: number,
    isHovered: boolean,
    hoverSpeed: number | undefined,
) {
    const rafRef = useRef<number | null>(null);
    const lastTimestampRef = useRef<number | null>(null);
    const offsetRef = useRef(0);
    const velocityRef = useRef(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        if (seqWidth > 0) {
            offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
            track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
        }

        const animate = (timestamp: number) => {
            if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;
            const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
            lastTimestampRef.current = timestamp;

            const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
            const easingFactor = 1 - Math.exp(-deltaTime / SMOOTH_TAU);
            velocityRef.current += (target - velocityRef.current) * easingFactor;

            if (seqWidth > 0) {
                let next = offsetRef.current + velocityRef.current * deltaTime;
                next = ((next % seqWidth) + seqWidth) % seqWidth;
                offsetRef.current = next;
                track.style.transform = `translate3d(${-next}px, 0, 0)`;
            }
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            lastTimestampRef.current = null;
        };
    }, [trackRef, targetVelocity, seqWidth, isHovered, hoverSpeed]);
}

export default function LogoLoop({
    items,
    renderItem,
    speed = 40,
    gap = 32,
    pauseOnHover = true,
    fadeOut = true,
    ariaLabel = 'Contact links',
}: LogoLoopProps) {
    const reduceMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);

    const [seqWidth, setSeqWidth] = useState(0);
    // Starts at a single copy (no duplication) until a real layout
    // measurement below decides how many are needed for a seamless loop —
    // this also keeps environments without real layout (e.g. jsdom tests,
    // no-JS) rendering exactly one accessible copy of each item.
    const [copyCount, setCopyCount] = useState(1);
    const [isHovered, setIsHovered] = useState(false);

    const targetVelocity = reduceMotion ? 0 : Math.abs(speed);
    const hoverSpeed = pauseOnHover ? 0 : undefined;

    const updateDimensions = useCallback(() => {
        const containerWidth = containerRef.current?.clientWidth ?? 0;
        const sequenceWidth = seqRef.current?.getBoundingClientRect?.().width ?? 0;
        if (sequenceWidth > 0) {
            setSeqWidth(Math.ceil(sequenceWidth));
            const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + COPY_HEADROOM;
            setCopyCount(Math.max(MIN_COPIES, copiesNeeded));
        }
    }, []);

    useResizeObserver(updateDimensions, [containerRef, seqRef], [items, gap]);
    useAnimationLoop(trackRef, targetVelocity, seqWidth, isHovered, hoverSpeed);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    const cssVariables = useMemo(() => ({ '--logoloop-gap': `${gap}px` } as React.CSSProperties), [gap]);

    const lists = useMemo(
        () =>
            Array.from({ length: copyCount }, (_, copyIndex) => (
                <ul
                    className={styles.list}
                    key={`copy-${copyIndex}`}
                    role="list"
                    aria-hidden={copyIndex > 0}
                    ref={copyIndex === 0 ? seqRef : undefined}>
                    {items.map((item, itemIndex) => (
                        <li className={styles.item} key={`${copyIndex}-${item.href}-${itemIndex}`} role="listitem">
                            {renderItem(item, itemIndex)}
                        </li>
                    ))}
                </ul>
            )),
        [copyCount, items, renderItem],
    );

    return (
        <div
            ref={containerRef}
            className={cx(styles.logoloop, fadeOut && styles.fade)}
            style={cssVariables}
            role="region"
            aria-label={ariaLabel}>
            <div className={styles.track} ref={trackRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {lists}
            </div>
        </div>
    );
}
