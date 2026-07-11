import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import Text from '../../components/Text';
import StarBorder from '../../components/StarBorder';
import HubCard from '../../components/HubCard';
import buttonStyles from '../../components/Button/Button.module.css';
import { cx } from '../../utils/cx';
import type { SanityHubEntrySummary } from '../../Types';
import styles from './HubTeaser.module.css';

type HubTeaserProps = {
    readonly entries: (SanityHubEntrySummary | null)[];
};

// Small "Things Worth Sharing" teaser on the About/home page — surfaces a
// hand-curated list of Hub entries (via about.featuredInAbout, in author order)
// with a CTA to the full /hub index. Renders nothing when no entries are
// curated yet. The responsive grid wraps to as many rows as needed, so there's
// no fixed entry count.
function HubTeaser({ entries }: HubTeaserProps) {
    // Entries come from dereferencing `featuredInAbout` refs; a stale/broken
    // reference (e.g. the target was deleted, or is temporarily unreadable)
    // resolves to `null` in the array rather than being dropped, so guard
    // against that instead of crashing the whole page.
    const resolvedEntries = entries.filter((entry): entry is SanityHubEntrySummary => Boolean(entry));
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
            <div className={styles.grid}>
                {resolvedEntries.map((entry) => (
                    <HubCard
                        key={entry.slug}
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
                    />
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

