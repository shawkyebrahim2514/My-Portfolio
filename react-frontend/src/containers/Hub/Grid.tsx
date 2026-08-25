import { memo } from 'react';
import HubCard from '../../components/HubCard';
import type { SanityHubEntrySummary } from '../../Types';
import styles from './Grid.module.css';

type GridProps = {
    readonly entries: SanityHubEntrySummary[];
    readonly empty?: string;
};

function Grid({ entries, empty = 'Nothing here yet. I’ll add more.' }: GridProps) {
    if (entries.length === 0) {
        return <p className={styles.empty}>{empty}</p>;
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
                    coverFocus={entry.coverFocus}
                    channelAvatar={entry.channel?.avatar}
                    durationLabel={entry.durationLabel}
                    categories={entry.categories}
                    language={entry.language}
                    accentColor={entry.accentColor}
                    hidden={entry.hiddenInProduction}
                />
            ))}
        </div>
    );
}

export default memo(Grid);
