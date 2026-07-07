import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import Text from '../../components/Text';
import Grid from './Grid';
import type { SanityHubEntrySummary, HubEntryCategoryRef } from '../../Types';
import styles from './HubRecommendations.module.css';

type HubRecommendationsProps = {
    readonly entries: SanityHubEntrySummary[];
    readonly category?: HubEntryCategoryRef;
};

function HubRecommendations({ entries, category }: HubRecommendationsProps) {
    if (entries.length === 0) return null;

    return (
        <section className={styles.section} aria-label="More in this category">
            <header className={styles.header}>
                <div className={styles.titleRow}>
                    <span className={styles.icon}>
                        <FontAwesomeIcon icon={faLayerGroup} />
                    </span>
                    <Text variant="h3">
                        {category ? `More in ${category.title}` : 'More to explore'}
                    </Text>
                </div>
                <hr className={styles.divider} />
            </header>
            <Grid entries={entries} />
        </section>
    );
}

export default memo(HubRecommendations);
