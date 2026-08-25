import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBookOpen, faHeadphones, faLayerGroup, faMagnifyingGlass, faNewspaper, faPodcast, faTv } from '@fortawesome/free-solid-svg-icons';
import Text from '../../components/Text';
import CategoryFilters, { countByCategorySlug } from './CategoryFilters';
import Grid from './Grid';
import LoadMore, { useLoadMore } from './LoadMore';
import { cx } from '../../utils/cx';
import type { HubEntryKind, SanityHubCategory, SanityHubEntrySummary } from '../../Types';
import styles from './CategoryFilters.module.css';

const KIND_ORDER: HubEntryKind[] = ['article', 'channel', 'podcast', 'listen', 'read'];

const KIND_META: Record<HubEntryKind, { label: string; icon: IconDefinition }> = {
    article: { label: 'Articles', icon: faNewspaper },
    channel: { label: 'Channels', icon: faTv },
    podcast: { label: 'Podcasts', icon: faPodcast },
    listen: { label: 'Listening Lists', icon: faHeadphones },
    read: { label: 'Reading Lists', icon: faBookOpen },
};

type HubPostsListingProps = {
    readonly entries: SanityHubEntrySummary[];
    readonly categories: SanityHubCategory[];
    readonly activeSlug?: string;
};

function matchesSearch(entry: SanityHubEntrySummary, normalizedQuery: string) {
    if (!normalizedQuery) return true;
    const text = [
        entry.title,
        entry.excerpt,
        entry.kind,
        KIND_META[entry.kind]?.label,
        entry.durationLabel,
        entry.channel?.name,
        ...entry.categories
            .filter((category): category is NonNullable<typeof category> => Boolean(category))
            .map((category) => category.title),
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    return text.includes(normalizedQuery);
}

function queryString(kind: 'all' | HubEntryKind, search: string) {
    const params = new URLSearchParams();
    if (kind !== 'all') params.set('type', kind);
    const query = search.trim();
    if (query) params.set('q', query);
    const value = params.toString();
    return value ? `?${value}` : '';
}

function HubPostsListing({ entries, categories, activeSlug }: HubPostsListingProps) {
    const [kindFilter, setKindFilter] = useState<'all' | HubEntryKind>('all');
    const [search, setSearch] = useState('');
    const [urlSyncReady, setUrlSyncReady] = useState(false);

    const entriesInCategory = useMemo(
        () =>
            activeSlug
                ? entries.filter((entry) => entry.categories.some((category) => category?.slug === activeSlug))
                : entries,
        [entries, activeSlug],
    );

    const normalizedQuery = search.trim().toLowerCase();
    const entriesInSearchView = useMemo(
        () => entriesInCategory.filter((entry) => matchesSearch(entry, normalizedQuery)),
        [entriesInCategory, normalizedQuery],
    );

    const kindCounts = useMemo(() => {
        const counts = new Map<HubEntryKind, number>();
        entriesInSearchView.forEach((entry) => {
            counts.set(entry.kind, (counts.get(entry.kind) ?? 0) + 1);
        });
        return counts;
    }, [entriesInSearchView]);

    const availableKinds = useMemo(
        () => KIND_ORDER.filter((kind) => (kindCounts.get(kind) ?? 0) > 0),
        [kindCounts],
    );

    const filteredEntries = useMemo(
        () =>
            kindFilter === 'all'
                ? entriesInSearchView
                : entriesInSearchView.filter((entry) => entry.kind === kindFilter),
        [entriesInSearchView, kindFilter],
    );

    const {visibleCount, loadMore} = useLoadMore(`${kindFilter}\0${search}\0${activeSlug ?? ''}`);
    const visibleEntries = filteredEntries.slice(0, visibleCount);

    const categorySource = useMemo(() => {
        const searchMatches = entries.filter((entry) => matchesSearch(entry, normalizedQuery));
        return kindFilter === 'all'
            ? searchMatches
            : searchMatches.filter((entry) => entry.kind === kindFilter);
    }, [entries, normalizedQuery, kindFilter]);

    const categoryCounts = useMemo(() => countByCategorySlug(categorySource), [categorySource]);
    const categoryOptions = useMemo(() => {
        if (!normalizedQuery && kindFilter === 'all') return categories;
        return categories.filter(
            (category) => category.slug === activeSlug || (categoryCounts.get(category.slug) ?? 0) > 0,
        );
    }, [categories, categoryCounts, normalizedQuery, kindFilter, activeSlug]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const kindParam = params.get('type');
        if (kindParam && KIND_ORDER.includes(kindParam as HubEntryKind)) {
            setKindFilter(kindParam as HubEntryKind);
        }

        const searchParam = params.get('q');
        if (searchParam) setSearch(searchParam);

        setUrlSyncReady(true);
    }, []);

    useEffect(() => {
        if (kindFilter !== 'all' && !availableKinds.includes(kindFilter)) {
            setKindFilter('all');
        }
    }, [kindFilter, availableKinds]);

    useEffect(() => {
        if (!urlSyncReady || typeof window === 'undefined') return;

        const nextSearch = queryString(kindFilter, search);
        const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
        const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (nextUrl !== currentUrl) {
            window.history.replaceState(window.history.state, '', nextUrl);
        }
    }, [urlSyncReady, kindFilter, search]);

    return (
        <>
            <section className={styles.filters} aria-label="Post filters">
                <div className={styles.filterGroup}>
                    <Text className={styles.filterLabel}>Type</Text>
                    <div className={styles.list}>
                        <button
                            type="button"
                            className={cx(styles.chip, kindFilter === 'all' && styles.active)}
                            onClick={() => setKindFilter('all')}
                        >
                            <span className={styles.icon}>
                                <FontAwesomeIcon icon={faLayerGroup} />
                            </span>
                            <span className={styles.label}>All</span>
                            <span className={styles.count}>{entriesInSearchView.length}</span>
                        </button>
                        {availableKinds.map((kind) => (
                            <button
                                key={kind}
                                type="button"
                                className={cx(styles.chip, kindFilter === kind && styles.active)}
                                onClick={() => setKindFilter(kind)}
                            >
                                <span className={styles.icon}>
                                    <FontAwesomeIcon icon={KIND_META[kind].icon} />
                                </span>
                                <span className={styles.label}>{KIND_META[kind].label}</span>
                                <span className={styles.count}>{kindCounts.get(kind) ?? 0}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <label className={styles.search} htmlFor="hub-post-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        id="hub-post-search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search a title or topic"
                    />
                </label>

                {categoryOptions.length > 0 && (
                    <div className={styles.filterGroup}>
                        <Text className={styles.filterLabel}>Category</Text>
                        <CategoryFilters
                            categories={categoryOptions}
                            activeSlug={activeSlug}
                            allCount={categorySource.length}
                            counts={categoryCounts}
                            query={queryString(kindFilter, search)}
                        />
                    </div>
                )}
            </section>

            <Grid
                entries={visibleEntries}
                empty={
                    entries.length === 0
                        ? 'Nothing here yet. I’ll add more.'
                        : 'Nothing matches that yet.'
                }
            />
            <LoadMore
                shown={visibleEntries.length}
                total={filteredEntries.length}
                onLoadMore={loadMore}
            />
        </>
    );
}

export default HubPostsListing;
