import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import Text from '../../components/Text';
import Grid from './Grid';
import { filterVisible } from './visibility';
import { useIsPreview } from '../../contexts/PreviewContext';
import type { SanityHubEntrySummary } from '../../Types';
import styles from './HubRecommendations.module.css';

type HubRecommendationsProps = {
    readonly entries: SanityHubEntrySummary[];
};

function HubRecommendations({ entries }: HubRecommendationsProps) {
    const isPreview = useIsPreview();
    const visibleEntries = filterVisible(entries, isPreview);
    if (visibleEntries.length === 0) return null;

    return (
        <section className={styles.section} aria-label="You might also like">
            <header className={styles.header}>
                <div className={styles.titleRow}>
                    <span className={styles.icon}>
                        <FontAwesomeIcon icon={faLayerGroup} />
                    </span>
                    <Text variant="h3">
                        You might also like
                    </Text>
                </div>
                <hr className={styles.divider} />
            </header>
            <Grid entries={visibleEntries} />
        </section>
    );
}

export default memo(HubRecommendations);
