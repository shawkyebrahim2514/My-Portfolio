import { memo, useEffect, useRef } from 'react';
import styles from './ReadingProgress.module.css';

// A thin bar pinned to the top of the viewport that fills as the reader
// scrolls the page. Used only on Article-kind Hub entries to reinforce their
// long-form, editorial feel. Purely decorative (aria-hidden); the width is
// driven imperatively on scroll to avoid re-rendering on every frame. Runs
// client-side after hydration — during SSR it renders at 0% width.
function ReadingProgress() {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - doc.clientHeight;
            const pct = max > 0 ? Math.min(100, Math.max(0, (doc.scrollTop / max) * 100)) : 0;
            if (barRef.current) barRef.current.style.width = `${pct}%`;
        };
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);

    return (
        <div className={styles.track} aria-hidden="true">
            <div ref={barRef} className={styles.bar} />
        </div>
    );
}

export default memo(ReadingProgress);
