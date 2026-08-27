import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useData } from 'vike-react/useData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faArrowUpRightFromSquare,
    faEyeSlash,
    faGlobe,
    faLayerGroup,
    faMagnifyingGlass,
    faPodcast,
    faRss,
    faStar,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
    faFacebook,
    faGithub,
    faLinkedin,
    faXTwitter,
    faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import ContainerWrap from '../../../src/components/ContainerWrap';
import Text from '../../../src/components/Text';
import RichContent from '../../../src/components/RichContent';
import Title from '../../../src/containers/Title';
import InlineSvg from '../../../src/components/InlineSvg';
import HubViewsNav from '../../../src/containers/Hub/ViewsNav';
import LoadMore, { useLoadMore } from '../../../src/containers/Hub/LoadMore';
import { filterVisible } from '../../../src/containers/Hub/visibility';
import { useIsPreview } from '../../../src/contexts/PreviewContext';
import { cx } from '../../../src/utils/cx';
import { resolveRemoteImageStyle, resolveYouTubeBannerUrl } from '../../../src/utils/remoteImageCrop';
import type {
    HubDirectoryType,
    HubDirectoryPlatform,
    HubEntryCategoryRef,
    SanityHubDirectoryChannel,
} from '../../../src/Types';
import type { HubChannelsDirectoryData } from './+data';
import section from '../../../src/styles/section.module.css';
import surfaces from '../../../src/styles/surfaces.module.css';
import lede from '../../../src/styles/lede.module.css';
import chipStyles from '../../../src/containers/Hub/CategoryFilters.module.css';
import styles from './HubChannelsPage.module.css';

const PLATFORM_META: Record<HubDirectoryPlatform, { label: string; icon: IconDefinition }> = {
    youtube: { label: 'YouTube', icon: faYoutube },
    github: { label: 'GitHub', icon: faGithub },
    linkedin: { label: 'LinkedIn', icon: faLinkedin },
    facebook: { label: 'Facebook', icon: faFacebook },
    podcast: { label: 'Podcasts', icon: faPodcast },
    website: { label: 'Website', icon: faGlobe },
    twitter: { label: 'Twitter (X)', icon: faXTwitter },
};

const PLATFORM_ACCENT: Record<HubDirectoryPlatform, string> = {
    youtube: '#e11d48',
    github: '#111827',
    linkedin: '#0a66c2',
    facebook: '#1877f2',
    podcast: '#6d5ae6',
    website: '#2563eb',
    twitter: '#111827',
};

const DIRECTORY_TYPE_META: Record<HubDirectoryType, { label: string; icon: IconDefinition }> = {
    subscription: { label: 'Subscriptions', icon: faRss },
    creator: { label: 'Creators', icon: faUser },
};

const DIRECTORY_TYPE_ORDER: HubDirectoryType[] = ['subscription', 'creator'];

const DIRECTORY_TYPE_PLATFORMS: Record<HubDirectoryType, HubDirectoryPlatform[]> = {
    subscription: ['youtube', 'podcast', 'website'],
    creator: ['github', 'linkedin', 'facebook', 'twitter', 'website'],
};

const ALL_DIRECTORY_PLATFORMS = Array.from(
    new Set([...DIRECTORY_TYPE_PLATFORMS.subscription, ...DIRECTORY_TYPE_PLATFORMS.creator]),
) as HubDirectoryPlatform[];

const CREATOR_PLATFORM_SET = new Set<HubDirectoryPlatform>(DIRECTORY_TYPE_PLATFORMS.creator);

function resolveDirectoryType(channel: SanityHubDirectoryChannel): HubDirectoryType {
    if (channel.type === 'subscription' || channel.type === 'creator') return channel.type;
    return CREATOR_PLATFORM_SET.has(channel.platform) ? 'creator' : 'subscription';
}

function matchesSearch(channel: SanityHubDirectoryChannel, normalizedQuery: string) {
    if (!normalizedQuery) return true;
    const text = [
        channel.name,
        channel.note,
        channel.deepDiveTitle,
        ...(channel.tags ?? []),
        ...channel.categories
            .filter((category): category is HubEntryCategoryRef => Boolean(category))
            .map((category) => category.title),
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
    return text.includes(normalizedQuery);
}

function HubChannelsPage() {
    const { page, categories } = useData<HubChannelsDirectoryData>();
    const isPreview = useIsPreview();
    const [directoryTypeFilter, setDirectoryTypeFilter] = useState<HubDirectoryType>('subscription');
    const [platformFilter, setPlatformFilter] = useState<'all' | HubDirectoryPlatform>('all');
    const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all');
    const [search, setSearch] = useState('');
    const [urlSyncReady, setUrlSyncReady] = useState(false);

    const visibleChannels = useMemo(
        () => filterVisible(page.channels ?? [], isPreview),
        [page.channels, isPreview],
    );

    const typeCounts = useMemo(() => {
        const counts = new Map<HubDirectoryType, number>([
            ['subscription', 0],
            ['creator', 0],
        ]);
        visibleChannels.forEach((channel) => {
            const type = resolveDirectoryType(channel);
            counts.set(type, (counts.get(type) ?? 0) + 1);
        });
        return counts;
    }, [visibleChannels]);

    const channelsInTypeView = useMemo(
        () => visibleChannels.filter((channel) => resolveDirectoryType(channel) === directoryTypeFilter),
        [visibleChannels, directoryTypeFilter],
    );

    const normalizedQuery = search.trim().toLowerCase();
    const channelsInTypeSearchView = useMemo(
        () => channelsInTypeView.filter((channel) => matchesSearch(channel, normalizedQuery)),
        [channelsInTypeView, normalizedQuery],
    );

    const platformCounts = useMemo(() => {
        const counts = new Map<HubDirectoryPlatform, number>();
        channelsInTypeSearchView.forEach((channel) => {
            counts.set(channel.platform, (counts.get(channel.platform) ?? 0) + 1);
        });
        return counts;
    }, [channelsInTypeSearchView]);

    const channelsInPlatformView = useMemo(
        () =>
            platformFilter === 'all'
                ? channelsInTypeSearchView
                : channelsInTypeSearchView.filter((channel) => channel.platform === platformFilter),
        [channelsInTypeSearchView, platformFilter],
    );

    const categoryCounts = useMemo(() => {
        const counts = new Map<string, number>();
        channelsInPlatformView.forEach((channel) => {
            const slugs = new Set(
                channel.categories
                    .filter((category): category is HubEntryCategoryRef => Boolean(category))
                    .map((category) => category.slug),
            );
            slugs.forEach((slug) => {
                counts.set(slug, (counts.get(slug) ?? 0) + 1);
            });
        });
        return counts;
    }, [channelsInPlatformView]);

    const categoryOptions = useMemo(
        () => categories.filter((category) => (categoryCounts.get(category.slug) ?? 0) > 0),
        [categories, categoryCounts],
    );

    const availablePlatforms = useMemo(
        () =>
            DIRECTORY_TYPE_PLATFORMS[directoryTypeFilter].filter(
                (platform) => (platformCounts.get(platform) ?? 0) > 0,
            ),
        [directoryTypeFilter, platformCounts],
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const typeParam = params.get('type');
        if (typeParam === 'creators' || typeParam === 'creator') {
            setDirectoryTypeFilter('creator');
        } else if (typeParam === 'subscriptions' || typeParam === 'subscription') {
            setDirectoryTypeFilter('subscription');
        }

        const sourceParam = params.get('source');
        if (sourceParam === 'all') {
            setPlatformFilter('all');
        } else if (
            sourceParam &&
            ALL_DIRECTORY_PLATFORMS.includes(sourceParam as HubDirectoryPlatform)
        ) {
            setPlatformFilter(sourceParam as HubDirectoryPlatform);
        }

        const categoryParam = params.get('category');
        if (categoryParam) {
            setCategoryFilter(categoryParam);
        }

        const searchParam = params.get('q');
        if (searchParam) {
            setSearch(searchParam);
        }

        setUrlSyncReady(true);
    }, []);

    useEffect(() => {
        if (platformFilter !== 'all' && !availablePlatforms.includes(platformFilter)) {
            setPlatformFilter('all');
        }
    }, [platformFilter, availablePlatforms]);

    useEffect(() => {
        if (categoryFilter !== 'all' && !categoryCounts.has(categoryFilter)) {
            setCategoryFilter('all');
        }
    }, [categoryFilter, categoryCounts]);

    useEffect(() => {
        if (!urlSyncReady || typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);

        if (directoryTypeFilter === 'subscription') params.delete('type');
        else params.set('type', 'creators');

        if (platformFilter === 'all') params.delete('source');
        else params.set('source', platformFilter);

        if (categoryFilter === 'all') params.delete('category');
        else params.set('category', categoryFilter);

        const query = search.trim();
        if (query) params.set('q', query);
        else params.delete('q');

        const nextSearch = params.toString();
        const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
        const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

        if (nextUrl !== currentUrl) {
            window.history.replaceState(null, '', nextUrl);
        }
    }, [urlSyncReady, directoryTypeFilter, platformFilter, categoryFilter, search]);

    const filteredChannels = useMemo(() => {
        return channelsInPlatformView
            .filter((channel) => {
                if (
                    categoryFilter !== 'all' &&
                    !channel.categories.some((category) => category?.slug === categoryFilter)
                ) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }, [channelsInPlatformView, categoryFilter]);

    const { visibleCount, loadMore } = useLoadMore(
        `${directoryTypeFilter}\0${platformFilter}\0${categoryFilter}\0${search}`,
    );
    const visibleChannelsPage = filteredChannels.slice(0, visibleCount);

    return (
        <div className={section.section}>
            <Title title={page.title} />
            <div className={cx(surfaces.container, surfaces.column)}>
                <HubViewsNav activeView="follows" />
                {page.intro.length > 0 && (
                    <div className={lede.lede}>
                        <RichContent value={page.intro} />
                    </div>
                )}

                <section className={styles.filters} aria-label="Follows filters">
                    <div className={styles.filterGroup}>
                        <Text className={styles.filterLabel}>Type</Text>
                        <div className={chipStyles.list}>
                            {DIRECTORY_TYPE_ORDER.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    className={cx(
                                        chipStyles.chip,
                                        directoryTypeFilter === type && chipStyles.active,
                                    )}
                                    onClick={() => setDirectoryTypeFilter(type)}
                                    data-clarity-event="hubFilter"
                                >
                                    <span className={chipStyles.icon}>
                                        <FontAwesomeIcon icon={DIRECTORY_TYPE_META[type].icon} />
                                    </span>
                                    <span className={chipStyles.label}>{DIRECTORY_TYPE_META[type].label}</span>
                                    <span className={chipStyles.count}>{typeCounts.get(type) ?? 0}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <label className={styles.search} htmlFor="hub-channel-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input
                            id="hub-channel-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search a name or topic"
                        />
                    </label>

                    <div className={styles.filterGroup}>
                        <Text className={styles.filterLabel}>Source</Text>
                        <div className={chipStyles.list}>
                            <button
                                type="button"
                                className={cx(
                                    chipStyles.chip,
                                    platformFilter === 'all' && chipStyles.active,
                                )}
                                onClick={() => setPlatformFilter('all')}
                                data-clarity-event="hubFilter"
                            >
                                <span className={chipStyles.label}>All</span>
                                <span className={chipStyles.count}>{channelsInTypeSearchView.length}</span>
                            </button>
                            {availablePlatforms.map((platform) => (
                                <button
                                    key={platform}
                                    type="button"
                                    className={cx(
                                        chipStyles.chip,
                                        platformFilter === platform && chipStyles.active,
                                    )}
                                    onClick={() => setPlatformFilter(platform)}
                                    data-clarity-event="hubFilter"
                                >
                                    <span className={chipStyles.icon}>
                                        <FontAwesomeIcon icon={PLATFORM_META[platform].icon} />
                                    </span>
                                    <span className={chipStyles.label}>{PLATFORM_META[platform].label}</span>
                                    <span className={chipStyles.count}>{platformCounts.get(platform) ?? 0}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {categoryOptions.length > 0 && (
                        <div className={styles.filterGroup}>
                            <Text className={styles.filterLabel}>Category</Text>
                            <div className={chipStyles.list}>
                                <button
                                    type="button"
                                    className={cx(
                                        chipStyles.chip,
                                        categoryFilter === 'all' && chipStyles.active,
                                    )}
                                    onClick={() => setCategoryFilter('all')}
                                    data-clarity-event="hubFilter"
                                >
                                    <span className={chipStyles.icon}>
                                        <FontAwesomeIcon icon={faLayerGroup} />
                                    </span>
                                    <span className={chipStyles.label}>All</span>
                                    <span className={chipStyles.count}>{channelsInPlatformView.length}</span>
                                </button>
                                {categoryOptions.map((category) => {
                                    const inlineSvg = category.icon?.metadata?.inlineSvg;
                                    return (
                                        <button
                                            key={category.slug}
                                            type="button"
                                            className={cx(
                                                chipStyles.chip,
                                                categoryFilter === category.slug && chipStyles.active,
                                            )}
                                            onClick={() => setCategoryFilter(category.slug)}
                                            data-clarity-event="hubFilter"
                                        >
                                            {inlineSvg ? (
                                                <InlineSvg className={chipStyles.icon} svg={inlineSvg} />
                                            ) : null}
                                            <span className={chipStyles.label}>{category.title}</span>
                                            <span className={chipStyles.count}>
                                                {categoryCounts.get(category.slug) ?? 0}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>

                {filteredChannels.length === 0 ? (
                    <Text className={styles.emptyState}>
                        Nothing matches that yet.
                    </Text>
                ) : (
                    <>
                    <div className={styles.grid}>
                        {visibleChannelsPage.map((channel) => {
                            const href = channel.deepDiveSlug ? `/hub/${channel.deepDiveSlug}` : channel.url;
                            if (!href) return null;
                            const isExternal = !channel.deepDiveSlug;
                            const meta = PLATFORM_META[channel.platform];
                            const accent = channel.accentColor ?? PLATFORM_ACCENT[channel.platform];
                            const resolvedCategories = channel.categories.filter(
                                (category): category is HubEntryCategoryRef => Boolean(category),
                            );
                            const isRTL = channel.language === 'ar';
                            return (
                                <a
                                    key={channel._key}
                                    href={href}
                                    target={isExternal ? '_blank' : undefined}
                                    rel={isExternal ? 'noopener noreferrer' : undefined}
                                    className={cx(surfaces.container, styles.card, isRTL && styles.rtl)}
                                    style={
                                        {
                                            '--channel-accent': accent,
                                        } as CSSProperties
                                    }
                                    dir={isRTL ? 'rtl' : undefined}
                                    lang={channel.language}
                                    data-clarity-event={isExternal ? 'follow' : undefined}
                                >
                                    <div className={styles.coverFrame} aria-hidden="true">
                                        {channel.coverImage && (
                                            <img
                                                className={styles.cover}
                                                src={resolveYouTubeBannerUrl(channel.coverImage)}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                                style={resolveRemoteImageStyle(channel.coverFocus)}
                                            />
                                        )}
                                    </div>
                                    <header className={styles.header}>
                                        {channel.avatar ? (
                                            <span className={styles.avatarFrame}>
                                                <img
                                                    className={styles.avatar}
                                                    src={channel.avatar}
                                                    alt=""
                                                    loading="lazy"
                                                    decoding="async"
                                                    style={resolveRemoteImageStyle(channel.avatarFocus, 'center')}
                                                />
                                            </span>
                                        ) : (
                                            <span className={styles.avatarFallback} aria-hidden="true">
                                                {channel.name.slice(0, 1).toUpperCase()}
                                            </span>
                                        )}
                                        <div className={styles.heading}>
                                            <div className={styles.badges}>
                                                <span className={styles.platform}>
                                                    <FontAwesomeIcon icon={meta.icon} />
                                                    {meta.label}
                                                </span>
                                                {channel.featured && (
                                                    <span className={styles.featured}>
                                                        <FontAwesomeIcon icon={faStar} />
                                                        Featured
                                                    </span>
                                                )}
                                                {channel.hiddenInProduction && (
                                                    <span className={styles.hidden}>
                                                        <FontAwesomeIcon icon={faEyeSlash} />
                                                        Hidden
                                                    </span>
                                                )}
                                            </div>
                                            <Text variant="h4">{channel.name}</Text>
                                        </div>
                                    </header>

                                    <Text className={styles.note}>{channel.note}</Text>

                                    {(resolvedCategories.length > 0 || (channel.tags?.length ?? 0) > 0) && (
                                        <div className={styles.tags}>
                                            {resolvedCategories.map((category) => (
                                                <span key={`cat-${channel._key}-${category.slug}`} className={styles.tag}>
                                                    {category.title}
                                                </span>
                                            ))}
                                            {(channel.tags ?? []).slice(0, 4).map((tag) => (
                                                <span key={`tag-${channel._key}-${tag}`} className={styles.tag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {channel.deepDiveTitle && (
                                        <Text className={styles.deepDive}>
                                            Deep dive: {channel.deepDiveTitle}
                                        </Text>
                                    )}

                                    <span className={styles.cta}>
                                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                        {channel.deepDiveSlug ? 'Read my notes' : 'Open it'}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                    <LoadMore
                        shown={visibleChannelsPage.length}
                        total={filteredChannels.length}
                        onLoadMore={loadMore}
                    />
                    </>
                )}
            </div>
        </div>
    );
}

export default ContainerWrap(HubChannelsPage);
