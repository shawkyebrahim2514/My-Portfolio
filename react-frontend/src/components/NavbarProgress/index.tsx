import { memo, useEffect, useRef, useState } from 'react';
import styles from './NavbarProgress.module.css';

// Reading-progress indicator drawn as a stroke that traces the sticky navbar's
// rounded border and fills clockwise as the reader scrolls the page. Used on
// long-form (article) Hub entries. Purely decorative (aria-hidden); the
// dash-offset is driven imperatively on scroll to avoid re-rendering per frame.
// Runs client-side after hydration — during SSR it renders an empty <svg>.

const STROKE = 3;
const RADIUS = 8; // matches --radius (tokens.css)

function NavbarProgress({ accent }: Readonly<{ accent?: string }>) {
    const svgRef = useRef<SVGSVGElement>(null);
    const barRef = useRef<SVGRectElement>(null);
    const [box, setBox] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

    // Measure the navbar (the SVG's positioned parent) so the ring's rounded
    // rectangle matches the navbar's exact pixel box with no aspect distortion.
    useEffect(() => {
        const nav = svgRef.current?.parentElement;
        if (!nav) return;
        const measure = () => setBox({ w: nav.clientWidth, h: nav.clientHeight });
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(nav);
        return () => ro.disconnect();
    }, []);

    // Drive stroke-dashoffset from scroll progress. pathLength=100 lets us treat
    // the whole perimeter as 0–100 regardless of the navbar's real size.
    useEffect(() => {
        const update = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - doc.clientHeight;
            const pct = max > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / max) * 100)) : 0;
            if (barRef.current) barRef.current.style.strokeDashoffset = String(100 - pct);
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, [box]);

    if (box.w === 0 || box.h === 0) {
        return <svg ref={svgRef} className={styles.svg} aria-hidden="true" />;
    }

    const inset = STROKE / 2;
    const rx = Math.max(0, RADIUS - inset);
    const rectProps = {
        x: inset,
        y: inset,
        width: box.w - STROKE,
        height: box.h - STROKE,
        rx,
        ry: rx,
        fill: 'none',
        strokeWidth: STROKE,
    };
    const color = accent || 'var(--color-secondary-500)';

    return (
        <svg
            ref={svgRef}
            className={styles.svg}
            viewBox={`0 0 ${box.w} ${box.h}`}
            aria-hidden="true"
        >
            <rect {...rectProps} className={styles.track} />
            <rect
                {...rectProps}
                ref={barRef}
                className={styles.bar}
                stroke={color}
                pathLength={100}
                strokeDasharray={100}
                strokeDashoffset={100}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 4px ${color})` }}
            />
        </svg>
    );
}

export default memo(NavbarProgress);
