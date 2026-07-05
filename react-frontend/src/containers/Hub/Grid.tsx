import { memo } from 'react';
import HubCard from '../../components/HubCard';
import type { SanityHubEntrySummary } from '../../Types';
import styles from './Grid.module.css';

type GridProps = {
    readonly entries: SanityHubEntrySummary[];
};

function Grid({ entries }: GridProps) {
    if (entries.length === 0) {
        return <p className={styles.empty}>Nothing here yet — check back soon.</p>;
    }

    return (
        <div className={styles.grid}>
            {entries.map((entry) => (
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
                />
            ))}
        </div>
    );
}

export default memo(Grid);
