import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowUpRightFromSquare,
    faEyeSlash,
    faLayerGroup,
    faMagnifyingGlass,
    faStar,
} from '@fortawesome/free-solid-svg-icons';
import Text from '../../components/Text';
import LoadMore, { useLoadMore } from './LoadMore';
import { cx } from '../../utils/cx';
import type { SanityHubLibraryCollection, SanityHubLibrarySave } from '../../Types';
import chipStyles from './CategoryFilters.module.css';
import styles from './LibraryListing.module.css';
import surfaces from '../../styles/surfaces.module.css';

type LibraryListingProps = {
    readonly collections: SanityHubLibraryCollection[];
    readonly saves: SanityHubLibrarySave[];
    readonly activeSlug?: string;
};

function hostnameFromUrl(url: string) {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
}

function matchesSearch(save: SanityHubLibrarySave, query: string) {
    if (!query) return true;
    const text = [save.title, save.note, save.collection?.title, ...(save.tags ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    return text.includes(query);
}

function LibraryListing({ collections, saves, activeSlug }: LibraryListingProps) {
    const [search, setSearch] = useState('');
    const normalizedQuery = search.trim().toLowerCase();

    const scopedSaves = useMemo(
        () => (activeSlug ? saves.filter((save) => save.collection?.slug === activeSlug) : saves),
        [saves, activeSlug],
    );

    const collectionCounts = useMemo(() => {
        const counts = new Map<string, number>();
        saves.forEach((save) => {
            const slug = save.collection?.slug;
            if (!slug) return;
            counts.set(slug, (counts.get(slug) ?? 0) + 1);
        });
        return counts;
    }, [saves]);

    const collectionOptions = useMemo(
        () =>
            collections.filter(
                (collection) =>
                    collection.slug === activeSlug || (collectionCounts.get(collection.slug) ?? 0) > 0,
            ),
        [collections, collectionCounts, activeSlug],
    );

    const filteredSaves = useMemo(
        () => scopedSaves.filter((save) => matchesSearch(save, normalizedQuery)),
        [scopedSaves, normalizedQuery],
    );

    const { visibleCount, loadMore } = useLoadMore(`${activeSlug ?? 'all'}\0${normalizedQuery}`);
    const visibleSaves = filteredSaves.slice(0, visibleCount);

    return (
        <>
            <section className={styles.filters} aria-label="Library filters">
                {collectionOptions.length > 0 && (
                    <div className={styles.filterGroup}>
                        <Text className={styles.filterLabel}>Collection</Text>
                        <div className={chipStyles.list}>
                            <a
                                href="/hub/library"
                                className={cx(chipStyles.chip, !activeSlug && chipStyles.active)}
                                data-clarity-event="hubFilter"
                            >
                                <span className={chipStyles.icon}>
                                    <FontAwesomeIcon icon={faLayerGroup} />
                                </span>
                                <span className={chipStyles.label}>All</span>
                                <span className={chipStyles.count}>{saves.length}</span>
                            </a>
                            {collectionOptions.map((collection) => (
                                <a
                                    key={collection.slug}
                                    href={`/hub/library/${collection.slug}`}
                                    className={cx(
                                        chipStyles.chip,
                                        activeSlug === collection.slug && chipStyles.active,
                                    )}
                                    data-clarity-event="hubFilter"
                                >
                                    <span className={chipStyles.label}>{collection.title}</span>
                                    <span className={chipStyles.count}>
                                        {collectionCounts.get(collection.slug) ?? 0}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <label className={styles.search} htmlFor="hub-library-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        id="hub-library-search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search a title or note"
                    />
                </label>
            </section>

            {filteredSaves.length === 0 ? (
                <Text className={styles.emptyState}>
                    {scopedSaves.length === 0
                        ? activeSlug
                            ? 'Nothing in this collection yet.'
                            : 'No public saves yet.'
                        : 'Nothing matches that yet.'}
                </Text>
            ) : (
                <>
                    <div className={styles.grid}>
                        {visibleSaves.map((save) => {
                            const isRTL = save.language === 'ar';
                            return (
                                <a
                                    key={save._key}
                                    href={save.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cx(surfaces.container, styles.card, isRTL && styles.rtl)}
                                    dir={isRTL ? 'rtl' : undefined}
                                    lang={save.language}
                                    data-clarity-event="librarySave"
                                >
                                    <header className={styles.header}>
                                        <div className={styles.badges}>
                                            {save.collection?.title && (
                                                <span className={styles.collection}>{save.collection.title}</span>
                                            )}
                                            {save.featured && (
                                                <span className={styles.featured}>
                                                    <FontAwesomeIcon icon={faStar} />
                                                    Featured
                                                </span>
                                            )}
                                            {save.hiddenInProduction && (
                                                <span className={styles.hidden}>
                                                    <FontAwesomeIcon icon={faEyeSlash} />
                                                    Hidden
                                                </span>
                                            )}
                                        </div>
                                        <Text variant="h4">{save.title}</Text>
                                    </header>
                                    <Text className={styles.note}>{save.note}</Text>
                                    {(save.tags?.length ?? 0) > 0 && (
                                        <div className={styles.tags}>
                                            {(save.tags ?? []).slice(0, 4).map((tag) => (
                                                <span key={`${save._key}-${tag}`} className={styles.tag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <span className={styles.host}>{hostnameFromUrl(save.url)}</span>
                                    <span className={styles.cta}>
                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                        Open it
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                    <LoadMore
                        shown={visibleSaves.length}
                        total={filteredSaves.length}
                        onLoadMore={loadMore}
                    />
                </>
            )}
        </>
    );
}

export default LibraryListing;
