import { memo, useEffect, useState } from 'react';
import { cx } from '../../utils/cx';
import styles from './ArticleToc.module.css';

export type TocHeading = {
    id: string;
    text: string;
    level: 2 | 3;
};

type ArticleTocProps = {
    readonly headings: TocHeading[];
    // Localised eyebrow label ("On this page" / "في هذه الصفحة").
    readonly label: string;
};

// The "On this page" table of contents shown on Article-kind Hub entries. It
// floats alongside the prose (see EntryDetail.module.css .articleProse) and
// highlights the section currently in view via an IntersectionObserver
// scroll-spy. Client-only behaviour: during SSR the first heading is marked
// active, then the observer takes over after hydration. Anchors also smooth
// -scroll and keep the URL hash in sync.
function ArticleToc({ headings, label }: ArticleTocProps) {
    const [activeId, setActiveId] = useState<string | undefined>(headings[0]?.id);

    useEffect(() => {
        const els = headings
            .map((h) => document.getElementById(h.id))
            .filter((el): el is HTMLElement => Boolean(el));
        if (els.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) {
                    setActiveId(visible[0].target.id);
                }
            },
            // Trip the active section a bit below the sticky navbar and well
            // before the heading leaves the top, so the highlight tracks the
            // section you're actually reading.
            { rootMargin: '-96px 0px -66% 0px', threshold: 0 },
        );
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [headings]);

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        event.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveId(id);
        if (typeof history !== 'undefined') {
            history.replaceState(null, '', `#${id}`);
        }
    };

    return (
        <nav className={styles.toc} aria-label={label}>
            <b className={styles.label}>{label}</b>
            {headings.map((h) => (
                <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={cx(styles.link, h.level === 3 && styles.sub, h.id === activeId && styles.on)}
                    onClick={(e) => handleClick(e, h.id)}
                >
                    {h.text}
                </a>
            ))}
        </nav>
    );
}

export default memo(ArticleToc);
