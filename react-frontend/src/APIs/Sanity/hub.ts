import {
    SanityHubPage,
    SanityHubEntry,
    SanityHubEntrySummary,
    SanityHubCategory,
    SanityHubChannelsDirectoryPage,
    SanityHubLibraryCollection,
    SanityHubLibraryPage,
    SanityHubLibrarySave,
} from '../../Types';
import sanityClient from './client';
import { listenCardCover } from '../../utils/youtube';

// Shared projection for card/list rendering — deliberately excludes
// `body`/`tags`, which are only needed on the /hub/[slug] detail page, to
// keep the /hub index + category listing queries light.
const entrySummaryProjection = `{
    title,
    "slug": slug.current,
    kind,
    language,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImage),
    coverFocus,
    "listenPreviewUrl": select(kind == "listen" => body[_type == "listeningItem" && defined(url)][0].url),
    "channel": select(kind == "channel" => {
        "platform": channel.platform,
        "url": channel.url,
        "name": channel.name,
        "channelId": channel.channelId,
        "handle": channel.handle,
        "avatar": channel.avatar
    }),
    durationLabel,
    publishedAt,
    featured,
    featuredInCategory,
    "accentColor": accent.hex,
    hiddenInProduction,
    "categories": categories[]->{ title, "slug": slug.current }
}`;

export const directoryChannelFields = `
    type,
    name,
    platform,
    url,
    avatar,
    avatarFocus,
    "coverImage": coalesce(coverImage.asset->url, coverImage),
    coverFocus,
    "accentColor": accent.hex,
    note,
    language,
    featured,
    hiddenInProduction,
    tags,
    "deepDiveSlug": deepDiveEntry->slug.current,
    "deepDiveTitle": deepDiveEntry->title,
    "categories": coalesce(categories[]->{ title, "slug": slug.current }, [])
`;

const getHubPage = async () => {
    const query = `*[_type == "hubPage"][0] {
        title,
        intro,
    }`;
    const result: SanityHubPage = await sanityClient.fetch(query);
    return result;
};

const getHubChannelsDirectoryPage = async () => {
    const query = `{
        "page": *[_type == "hubChannelsDirectoryPage"][0]{ title, intro },
        "channels": *[_type == "hubFollow"] | order(coalesce(featured, false) desc, name asc) {
            "_key": _id,
            ${directoryChannelFields}
        }
    }`;
    const result: {
        page: Pick<SanityHubChannelsDirectoryPage, 'title' | 'intro'> | null;
        channels: SanityHubChannelsDirectoryPage['channels'];
    } = await sanityClient.fetch(query);
    const channels = result.channels ?? [];
    if (!result.page && channels.length === 0) return null;
    return {
        title: result.page?.title ?? {
            highlightedText: 'Follows',
            subText: 'People and channels I follow',
        },
        intro: result.page?.intro ?? [],
        channels,
    };
};

type HubEntrySummaryRow = SanityHubEntrySummary & { listenPreviewUrl?: string };

// Listening lists can omit a custom cover; Hub cards then use the first clip
// thumbnail so the grid is not a text-only row.
export function withCardCover(entry: HubEntrySummaryRow): SanityHubEntrySummary {
    const { listenPreviewUrl, ...rest } = entry;
    return {
        ...rest,
        coverImage: listenCardCover(entry.kind, entry.coverImage, listenPreviewUrl),
    };
}

const getHubEntries = async () => {
    const query = `*[_type == "hubEntry"] | order(publishedAt desc) ${entrySummaryProjection}`;
    const result: HubEntrySummaryRow[] = await sanityClient.fetch(query);
    return result.map(withCardCover);
};

const getHubEntriesByCategory = async (categorySlug: string) => {
    const query = `*[_type == "hubEntry" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) ${entrySummaryProjection}`;
    const result: HubEntrySummaryRow[] = await sanityClient.fetch(query, { categorySlug });
    return result.map(withCardCover);
};

const getHubEntryBySlug = async (slug: string) => {
    const query = `*[_type == "hubEntry" && slug.current == $slug][0] {
        title,
        "slug": slug.current,
        kind,
        language,
        excerpt,
        "coverImage": coalesce(coverImage.asset->url, coverImage),
        coverFocus,
        "channel": select(kind == "channel" => {
            "platform": channel.platform,
            "url": channel.url,
            "name": channel.name,
            "channelId": channel.channelId,
            "handle": channel.handle,
            "avatar": channel.avatar,
            "moreVideos": channel.moreVideos[]{
                "_type": "youtube",
                _key,
                url,
                caption
            }
        }),
        durationLabel,
        publishedAt,
        featured,
        featuredInCategory,
        "accentColor": accent.hex,
        hiddenInProduction,
        platforms,
        tags,
        "body": select(kind == "channel" => channel.body, body),
        "categories": categories[]->{ title, "slug": slug.current }
    }`;
    const result: SanityHubEntry = await sanityClient.fetch(query, { slug });
    return result;
};

// "More like this" list for the /hub/<slug> detail page. Reads the
// category's hand-picked `recommendedEntries` in the stored (drag-ordered)
// order — may include entries from other categories. References resolve to
// published docs at prerender; deleted/unpublished refs come back null, and the
// current entry is filtered out. No cap: every curated entry is shown.
const getHubRecommendations = async (categorySlug: string, excludeSlug: string) => {
    const query = `*[_type == "hubCategory" && slug.current == $categorySlug][0].recommendedEntries[]->${entrySummaryProjection}`;
    const result: (HubEntrySummaryRow | null)[] | null = await sanityClient.fetch(query, { categorySlug });
    return (result ?? [])
        .filter((entry): entry is HubEntrySummaryRow => entry != null && entry.slug !== excludeSlug)
        .map(withCardCover);
};

// Used by pages/hub/@slug/+onBeforePrerenderStart.ts to enumerate every
// entry slug so Vike can prerender each /hub/<slug> page at build time.
const getHubEntrySlugs = async () => {
    const query = `*[_type == "hubEntry"].slug.current`;
    const result: string[] = await sanityClient.fetch(query);
    return result;
};

const getHubCategories = async () => {
    const query = `*[_type == "hubCategory"] | order(coalesce(order, 999) asc, title asc) {
        title,
        "slug": slug.current,
        description,
        accentColor,
        icon { icon, metadata { inlineSvg, iconName } }
    }`;
    const result: SanityHubCategory[] = await sanityClient.fetch(query);
    return result;
};

const getHubCategoryBySlug = async (slug: string) => {
    const query = `*[_type == "hubCategory" && slug.current == $slug][0] {
        title,
        "slug": slug.current,
        description,
        accentColor,
        icon { icon, metadata { inlineSvg, iconName } }
    }`;
    const result: SanityHubCategory = await sanityClient.fetch(query, { slug });
    return result;
};

// Used by pages/hub/category/@slug/+onBeforePrerenderStart.ts.
const getHubCategorySlugs = async () => {
    const query = `*[_type == "hubCategory"].slug.current`;
    const result: string[] = await sanityClient.fetch(query);
    return result;
};

const librarySaveProjection = `{
    "_key": _id,
    title,
    url,
    note,
    language,
    featured,
    hiddenInProduction,
    tags,
    "collection": collection->{ title, "slug": slug.current }
}`;

const getHubLibraryPage = async () => {
    const query = `*[_type == "hubLibraryPage"][0]{ title, intro }`;
    const result: Pick<SanityHubLibraryPage, 'title' | 'intro'> | null = await sanityClient.fetch(query);
    return result;
};

const getHubLibraryCollections = async () => {
    const query = `*[_type == "hubLibraryCollection"] | order(coalesce(order, 9999) asc, title asc) {
        title,
        "slug": slug.current,
        description,
        order
    }`;
    const result: SanityHubLibraryCollection[] = await sanityClient.fetch(query);
    return result;
};

const getHubLibraryCollectionBySlug = async (slug: string) => {
    const query = `*[_type == "hubLibraryCollection" && slug.current == $slug][0] {
        title,
        "slug": slug.current,
        description,
        order
    }`;
    const result: SanityHubLibraryCollection | null = await sanityClient.fetch(query, { slug });
    return result;
};

const getHubLibraryCollectionSlugs = async () => {
    const query = `*[_type == "hubLibraryCollection"].slug.current`;
    const result: string[] = await sanityClient.fetch(query);
    return result;
};

const getHubLibrarySaves = async () => {
    const query = `*[_type == "hubLibrarySave"] | order(coalesce(featured, false) desc, title asc) ${librarySaveProjection}`;
    const result: SanityHubLibrarySave[] = await sanityClient.fetch(query);
    return result;
};

export {
    getHubPage,
    getHubChannelsDirectoryPage,
    getHubEntries,
    getHubEntriesByCategory,
    getHubEntryBySlug,
    getHubRecommendations,
    getHubEntrySlugs,
    getHubCategories,
    getHubCategoryBySlug,
    getHubCategorySlugs,
    getHubLibraryPage,
    getHubLibraryCollections,
    getHubLibraryCollectionBySlug,
    getHubLibraryCollectionSlugs,
    getHubLibrarySaves,
}
