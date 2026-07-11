import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBookOpen } from '@fortawesome/free-solid-svg-icons';
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

// "Things Worth Sharing" teaser — DESIGN 02: Horizontal Rail + Marquee header.
// A scrolling ticker headline sits above a horizontal, scroll-snapping rail of
// cards you can flick through. Curated Hub entries come from about.featuredInAbout
// (author order); hidden entries are filtered unless preview mode is on.
function HubTeaser({ entries }: HubTeaserProps) {
    const isPreview = useIsPreview();
    const resolvedEntries = filterVisible(
        entries.filter((entry): entry is SanityHubEntrySummary => Boolean(entry)),
        isPreview,
    );
    if (resolvedEntries.length === 0) return null;

    // Build a seamless marquee from the entry titles; duplicated so the track
    // can loop without a visible seam.
    const tickerItems = resolvedEntries.map((entry) => entry.title);
    const marqueeItems = [...tickerItems, ...tickerItems];

    return (
        <div className={styles.teaser}>
            <header className={styles.header}>
                <div className={styles.titleRow}>
                    <FontAwesomeIcon icon={faBookOpen} size="xl" className={styles.titleIcon} />
                    <Text variant="h3">Things Worth Sharing</Text>
                </div>
                <div className={styles.marquee} aria-hidden="true">
                    <div className={styles.marqueeTrack}>
                        {marqueeItems.map((title, i) => (
                            <span className={styles.marqueeItem} key={`${title}-${i}`}>
                                <span className={styles.marqueeDot} />
                                {title}
                            </span>
                        ))}
                    </div>
                </div>
            </header>

            <div className={styles.railWrap}>
                <div className={styles.rail}>
                    {resolvedEntries.map((entry) => (
                        <div className={styles.railItem} key={entry.slug}>
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
                    <div className={styles.railEnd}>
                        <StarBorder>
                            <a href="/hub" className={cx(buttonStyles.button, buttonStyles.md, buttonStyles.pointer, styles.cta)}>
                                Visit the Hub
                                <FontAwesomeIcon icon={faArrowRight} />
                            </a>
                        </StarBorder>
                    </div>
                </div>
                <span className={styles.fadeLeft} aria-hidden="true" />
                <span className={styles.fadeRight} aria-hidden="true" />
            </div>
        </div>
    );
}

export default memo(HubTeaser);
