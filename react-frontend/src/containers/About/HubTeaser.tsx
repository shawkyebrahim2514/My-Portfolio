import { memo } from 'react';
import { faNewspaper, faPodcast, faBookOpen, faTv } from '@fortawesome/free-solid-svg-icons';
import { filterVisible } from '../Hub/visibility';
import { KIND_ACCENT } from '../Hub/kindAccent';
import { useIsPreview } from '../../contexts/PreviewContext';
import type { HubEntryKind, SanityHubEntrySummary } from '../../Types';
import MagazineTeaser from './MagazineTeaser';

type HubTeaserProps = {
    readonly entries: (SanityHubEntrySummary | null)[];
};

const KIND_META: Record<HubEntryKind, { icon: typeof faNewspaper; label: string }> = {
    article: { icon: faNewspaper, label: 'Article' },
    channel: { icon: faTv, label: 'Channel' },
    podcast: { icon: faPodcast, label: 'Podcast' },
    read: { icon: faBookOpen, label: 'Reading List' },
};

function entryAccent(entry: SanityHubEntrySummary): string {
    return entry.accentColor ?? KIND_ACCENT[entry.kind] ?? KIND_ACCENT.article;
}

function HubTeaser({ entries }: HubTeaserProps) {
    const isPreview = useIsPreview();
    const resolvedEntries = filterVisible(
        entries.filter((entry): entry is SanityHubEntrySummary => Boolean(entry)),
        isPreview,
    );

    return (
        <MagazineTeaser
            title="Things Worth Sharing"
            subtitle="Picked by me · New posts land here"
            ctaHref="/hub"
            ctaLabel="Open the Hub"
            items={resolvedEntries.map((entry) => {
                const meta = KIND_META[entry.kind] ?? KIND_META.article;
                return {
                    key: entry.slug,
                    href: `/hub/${entry.slug}`,
                    title: entry.title,
                    excerpt: entry.excerpt,
                    image: entry.channel?.avatar ?? entry.coverImage,
                    accent: entryAccent(entry),
                    badgeIcon: meta.icon,
                    badgeLabel: meta.label,
                    language: entry.language,
                    hidden: entry.hiddenInProduction,
                };
            })}
        />
    );
}

export default memo(HubTeaser);
