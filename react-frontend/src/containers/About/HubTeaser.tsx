import { memo } from 'react';
import type { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faNewspaper, faPodcast, faBookOpen, faTv, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import StarBorder from '../../components/StarBorder';
import { filterVisible } from '../Hub/visibility';
import { KIND_ACCENT } from '../Hub/kindAccent';
import { useIsPreview } from '../../contexts/PreviewContext';
import buttonStyles from '../../components/Button/Button.module.css';
import { cx } from '../../utils/cx';
import type { HubEntryKind, SanityHubEntrySummary } from '../../Types';
import styles from './HubTeaser.module.css';

type HubTeaserProps = {
    readonly entries: (SanityHubEntrySummary | null)[];
};

const KIND_META: Record<HubEntryKind, { icon: typeof faNewspaper; label: string }> = {
    article: { icon: faNewspaper, label: 'Article' },
    channel: { icon: faTv, label: 'Channel' },
    podcast: { icon: faPodcast, label: 'Podcast' },
    read: { icon: faBookOpen, label: 'Reading List' },
};

// A per-entry accent wins, otherwise the kind default.
function entryAccent(entry: SanityHubEntrySummary): string {
    return entry.accentColor ?? KIND_ACCENT[entry.kind] ?? KIND_ACCENT.article;
}

// "Things Worth Sharing" home teaser — Magazine Bento. An asymmetric bento grid
// on a dark editorial canvas: one large featured pick (cover bleed) plus
// satellite cards, index numerals and per-entry accent rails. Deliberately
// breaks the light, uniform-grid rhythm of the rest of the site.
function HubTeaser({ entries }: HubTeaserProps) {
    const isPreview = useIsPreview();
    const resolvedEntries = filterVisible(
        entries.filter((entry): entry is SanityHubEntrySummary => Boolean(entry)),
        isPreview,
    );
    if (resolvedEntries.length === 0) return null;

    // The featured cell shows a cover bleed, so prefer the first entry that has
    // an image; fall back to the first entry otherwise.
    const heroIndex = Math.max(
        0,
        resolvedEntries.findIndex((e) => Boolean(e.coverImage ?? e.sourceThumbnail)),
    );
    const hero = resolvedEntries[heroIndex];
    const rest = resolvedEntries.filter((_, i) => i !== heroIndex);
    const ordered = [hero, ...rest];

    const renderCell = (entry: SanityHubEntrySummary, index: number, isFeat: boolean) => {
        const accent = entryAccent(entry);
        const { icon, label } = KIND_META[entry.kind] ?? KIND_META.article;
        const image = entry.coverImage ?? entry.sourceThumbnail;
        const showBg = isFeat && Boolean(image);
        const isRTL = entry.language === 'ar';

        return (
            <a
                key={entry.slug}
                href={`/hub/${entry.slug}`}
                className={cx(styles.cell, isFeat && styles.feat)}
                style={{ '--a': accent } as CSSProperties}
            >
                {showBg ? (
                    <span className={styles.bg} style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />
                ) : (
                    <span className={styles.tint} aria-hidden="true" />
                )}
                <span className={styles.rail} aria-hidden="true" />
                <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
                {entry.hiddenInProduction && (
                    <span className={styles.hiddenPill} title="Hidden from production — visible only in preview mode">
                        <FontAwesomeIcon icon={faEyeSlash} />
                        Hidden
                    </span>
                )}
                <span className={styles.badge}>
                    <FontAwesomeIcon icon={icon} />
                    {label}
                </span>
                <h4 className={cx(styles.title, isRTL && styles.rtl)} dir={isRTL ? 'rtl' : undefined} lang={entry.language}>
                    {entry.title}
                </h4>
                <p className={cx(styles.excerpt, isRTL && styles.rtl)} dir={isRTL ? 'rtl' : undefined} lang={entry.language}>
                    {entry.excerpt}
                </p>
            </a>
        );
    };

    return (
        <div className={styles.teaser}>
            <div className={styles.kicker}>
                <h3 className={styles.kickerTitle}>Things Worth Sharing</h3>
                <span className={styles.kickerSub}>Curated · Updated often</span>
            </div>

            <div className={styles.grid}>
                {ordered.map((entry, i) => renderCell(entry, i, i === 0))}
            </div>

            <div className={styles.foot}>
                <StarBorder>
                    <a href="/hub" className={cx(buttonStyles.button, buttonStyles.md, buttonStyles.pointer, styles.cta)}>
                        Visit the Hub
                        <FontAwesomeIcon icon={faArrowRight} />
                    </a>
                </StarBorder>
            </div>
        </div>
    );
}

export default memo(HubTeaser);
