// A gently curving, draggable marquee of repeating text along an SVG path.
// Ported from React Bits' CurvedLoop (pure SVG textPath, no extra dependency)
// and restyled/rescaled from its full-viewport hero demo into a compact
// decorative banner that fits under a page section.
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { useReducedMotion } from '@react-spring/web';
import styles from './CurvedLoop.module.css';

type CurvedLoopProps = {
    readonly text: string;
    readonly speed?: number;
    readonly curveAmount?: number;
};

export default function CurvedLoop({ text: rawText, speed = 1.2, curveAmount = 50 }: CurvedLoopProps) {
    const reduceMotion = useReducedMotion();

    const text = useMemo(() => {
        const hasTrailing = /\s|\u00A0$/.test(rawText);
        return (hasTrailing ? rawText.replace(/\s+$/, '') : rawText) + '\u00A0';
    }, [rawText]);

    const measureRef = useRef<SVGTextElement | null>(null);
    const textPathRef = useRef<SVGTextPathElement | null>(null);
    const [spacing, setSpacing] = useState(0);
    const [offset, setOffset] = useState(0);
    const uid = useId();
    const pathId = `curved-loop-${uid}`;
    const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

    const dragRef = useRef(false);
    const lastXRef = useRef(0);
    const directionRef = useRef<'left' | 'right'>('left');
    const velocityRef = useRef(0);

    const totalText = spacing ? Array(Math.ceil(1800 / spacing) + 2).fill(text).join('') : text;
    const ready = spacing > 0;

    useEffect(() => {
        if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
    }, [text]);

    useEffect(() => {
        if (!spacing || !textPathRef.current) return;
        const initial = -spacing;
        textPathRef.current.setAttribute('startOffset', `${initial}px`);
        setOffset(initial);
    }, [spacing]);

    useEffect(() => {
        if (!spacing || !ready) return;
        let frame = 0;
        const step = () => {
            // Auto-scroll pauses under prefers-reduced-motion; dragging (a
            // direct, user-initiated action) still works either way.
            if (!dragRef.current && !reduceMotion && textPathRef.current) {
                const delta = directionRef.current === 'right' ? speed : -speed;
                const current = parseFloat(textPathRef.current.getAttribute('startOffset') ?? '0');
                let next = current + delta;
                if (next <= -spacing) next += spacing;
                if (next > 0) next -= spacing;
                textPathRef.current.setAttribute('startOffset', `${next}px`);
                setOffset(next);
            }
            frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [spacing, speed, ready, reduceMotion]);

    const onPointerDown = (event: PointerEvent) => {
        dragRef.current = true;
        lastXRef.current = event.clientX;
        velocityRef.current = 0;
        (event.target as Element).setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
        if (!dragRef.current || !textPathRef.current) return;
        const dx = event.clientX - lastXRef.current;
        lastXRef.current = event.clientX;
        velocityRef.current = dx;
        const current = parseFloat(textPathRef.current.getAttribute('startOffset') ?? '0');
        let next = current + dx;
        if (next <= -spacing) next += spacing;
        if (next > 0) next -= spacing;
        textPathRef.current.setAttribute('startOffset', `${next}px`);
        setOffset(next);
    };

    const endDrag = () => {
        dragRef.current = false;
        directionRef.current = velocityRef.current > 0 ? 'right' : 'left';
    };

    return (
        <div
            className={styles.jacket}
            style={{ visibility: ready ? 'visible' : 'hidden' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            aria-hidden="true">
            <svg className={styles.svg} viewBox="0 0 1440 140">
                <text ref={measureRef} xmlSpace="preserve" className={styles.measure}>
                    {text}
                </text>
                <defs>
                    <path id={pathId} d={pathD} fill="none" stroke="transparent" />
                </defs>
                {ready && (
                    <text className={styles.text} xmlSpace="preserve">
                        <textPath ref={textPathRef} href={`#${pathId}`} startOffset={`${offset}px`} xmlSpace="preserve">
                            {totalText}
                        </textPath>
                    </text>
                )}
            </svg>
        </div>
    );
}
