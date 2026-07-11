import { memo, useState } from 'react';
import type { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import Text from '../../components/Text';
import StarBorder from '../../components/StarBorder';
import HubCard from '../../components/HubCard';
import { filterVisible } from '../Hub/visibility';
import { KIND_ACCENT } from '../Hub/kindAccent';
import { useIsPreview } from '../../contexts/PreviewContext';
import buttonStyles from '../../components/Button/Button.module.css';
import { cx } from '../../utils/cx';
import type { SanityHubEntrySummary } from '../../Types';
import styles from './HubTeaser.module.css';

type HubTeaserProps = {
    readonly entries: (SanityHubEntrySummary | null)[];
};

// The colour that drives both the card accent and the ambient spotlight for an
// entry — a per-entry accent wins, otherwise the kind default.
function entryAccent(entry: SanityHubEntrySummary): string {
    return entry.accentColor ?? KIND_ACCENT[entry.kind] ?? KIND_ACCENT.article;
}

// "Things Worth Sharing" teaser — DESIGN 07: Magazine Bento + Accent Spotlight.
// A bento grid with one large hero cell + smaller satellites. Hovering (or
// focusing) any card washes the whole section in that entry's accent and dims
// the others, so attention follows the pointer. Curated Hub entries come from
// about.featuredInAbout; hidden entries are filtered unless preview is on.
function HubTeaser({ entries }: HubTeaserProps) {
    const isPreview = useIsPreview();
    const resolvedEntries = filterVisible(
        entries.filter((entry): entry is SanityHubEntrySummary => Boolean(entry)),
        isPreview,
    );

    // Which entry is currently spotlighted (by slug) + its accent colour.
    const [active, setActive] = useState<{ slug: string; accent: string } | null>(null);

    if (resolvedEntries.length === 0) return null;

    // Hero = the first entry that carries an image (biggest visual payoff in the
    // large cell); fall back to the first entry. The rest keep author order.
    const heroIndex = Math.max(
        0,
        resolvedEntries.findIndex((e) => Boolean(e.coverImage ?? e.sourceThumbnail)),
    );
    const hero = resolvedEntries[heroIndex];
    const rest = resolvedEntries.filter((_, i) => i !== heroIndex);
    const ordered = [hero, ...rest];

    const renderCard = (entry: SanityHubEntrySummary, isHero: boolean) => {
        const accent = entryAccent(entry);
        const dimmed = active !== null && active.slug !== entry.slug;
        return (
            <div
                key={entry.slug}
                className={cx(styles.cell, isHero && styles.hero, dimmed && styles.dimmed)}
                onMouseEnter={() => setActive({ slug: entry.slug, accent })}
                onFocusCapture={() => setActive({ slug: entry.slug, accent })}
            >
                <HubCard
                    title={entry.title}
                    slug={entry.slug}
                    kind={entry.kind}
                    excerpt={entry.excerpt}
                    coverImage={entry.coverImage}
                    sourceThumbnail={entry.sourceThumbnail}
                    durationLabel={entry.durationLabel}
                    categories={entry.categories}
                    language={entry.language}
                    accentColor={entry.accentColor}
                    hidden={entry.hiddenInProduction}
                />
            </div>
        );
    };

    return (
        <div
            className={cx(styles.teaser, active && styles.lit)}
            style={{ '--spotlight': active?.accent ?? 'transparent' } as CSSProperties}
            onMouseLeave={() => setActive(null)}
            onBlurCapture={() => setActive(null)}
        >
            <span className={styles.ambient} aria-hidden="true" />
            <header className={styles.header}>
                <div className={styles.titleRow}>
                    <FontAwesomeIcon icon={faBookOpen} size="xl" className={styles.titleIcon} />
                    <Text variant="h3">Things Worth Sharing</Text>
                </div>
                <hr className={styles.divider} />
            </header>

            <div className={styles.bento}>
                {ordered.map((entry, i) => renderCard(entry, i === 0))}
            </div>

            <StarBorder>
                <a href="/hub" className={cx(buttonStyles.button, buttonStyles.md, buttonStyles.pointer, styles.cta)}>
                    Visit the Hub
                    <FontAwesomeIcon icon={faArrowRight} />
                </a>
            </StarBorder>
        </div>
    );
}

export default memo(HubTeaser);
