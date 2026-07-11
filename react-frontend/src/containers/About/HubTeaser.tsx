import { memo } from 'react';
import type { CSSProperties } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBookOpen, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import Text from '../../components/Text';
import StarBorder from '../../components/StarBorder';
import HubCard from '../../components/HubCard';
import { filterVisible } from '../Hub/visibility';
import { useIsPreview } from '../../contexts/PreviewContext';
import buttonStyles from '../../components/Button/Button.module.css';
import { cx } from '../../utils/cx';
import type { SanityHubEntrySummary } from '../../Types';
import styles from './HubTeaser.module.css';

type HubTeaserProps = {
    readonly entries: (SanityHubEntrySummary | null)[];
};

// Deterministic per-position tilt so the board looks hand-pinned but renders the
// same every time (no layout jitter between server + client).
const ROTATIONS = [-2.5, 1.8, -1.4, 2.3, -2, 1.3, -1.7, 2.6, -1.1, 2];

// "Things Worth Sharing" teaser — DESIGN 06: Collage / Pinboard.
// The featured entries are pinned to a board as slightly-rotated cards with a
// strip of tape; hovering straightens and lifts a card. Curated Hub entries come
// from about.featuredInAbout; hidden entries are filtered unless preview is on.
function HubTeaser({ entries }: HubTeaserProps) {
    const isPreview = useIsPreview();
    const resolvedEntries = filterVisible(
        entries.filter((entry): entry is SanityHubEntrySummary => Boolean(entry)),
        isPreview,
    );
    if (resolvedEntries.length === 0) return null;

    return (
        <div className={styles.teaser}>
            <header className={styles.header}>
                <div className={styles.titleRow}>
                    <FontAwesomeIcon icon={faBookOpen} size="xl" className={styles.titleIcon} />
                    <Text variant="h3">Things Worth Sharing</Text>
                </div>
                <hr className={styles.divider} />
            </header>

            <div className={styles.board}>
                {resolvedEntries.map((entry, i) => (
                    <div
                        className={styles.pin}
                        key={entry.slug}
                        style={{ '--rot': `${ROTATIONS[i % ROTATIONS.length]}deg` } as CSSProperties}
                    >
                        <span className={styles.tape} aria-hidden="true" />
                        <FontAwesomeIcon icon={faThumbtack} className={styles.tack} aria-hidden="true" />
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
                ))}
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
