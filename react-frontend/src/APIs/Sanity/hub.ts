import { SanityHubPage, SanityHubEntry, SanityHubEntrySummary, SanityHubCategory } from '../../Types';
import sanityClient from './client';

// Shared projection for card/list rendering — deliberately excludes
// `body`/`tags`, which are only needed on the /hub/[slug] detail page, to
// keep the /hub index + category listing queries light.
const entrySummaryProjection = `{
    title,
    "slug": slug.current,
    kind,
    language,
    excerpt,
    "coverImage": coverImage.asset->url,
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

const getHubPage = async () => {
    const query = `*[_type == "hubPage"][0] {
        title,
        intro,
    }`;
    const result: SanityHubPage = await sanityClient.fetch(query);
    return result;
};

const getHubEntries = async () => {
    const query = `*[_type == "hubEntry"] | order(publishedAt desc) ${entrySummaryProjection}`;
    const result: SanityHubEntrySummary[] = await sanityClient.fetch(query);
    return result;
};

const getHubEntriesByCategory = async (categorySlug: string) => {
    const query = `*[_type == "hubEntry" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) ${entrySummaryProjection}`;
    const result: SanityHubEntrySummary[] = await sanityClient.fetch(query, { categorySlug });
    return result;
};

const getHubEntryBySlug = async (slug: string) => {
    const query = `*[_type == "hubEntry" && slug.current == $slug][0] {
        title,
        "slug": slug.current,
        kind,
        language,
        excerpt,
        "coverImage": coverImage.asset->url,
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

// Curated "You might also like" list for the /hub/<slug> detail page. Reads the
// category's hand-picked `recommendedEntries` in the stored (drag-ordered)
// order — may include entries from other categories. References resolve to
// published docs at prerender; deleted/unpublished refs come back null, and the
// current entry is filtered out. No cap: every curated entry is shown.
const getHubRecommendations = async (categorySlug: string, excludeSlug: string) => {
    const query = `*[_type == "hubCategory" && slug.current == $categorySlug][0].recommendedEntries[]->${entrySummaryProjection}`;
    const result: (SanityHubEntrySummary | null)[] | null = await sanityClient.fetch(query, { categorySlug });
    return (result ?? []).filter(
        (entry): entry is SanityHubEntrySummary => Boolean(entry) && entry!.slug !== excludeSlug,
    );
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

export {
    getHubPage,
    getHubEntries,
    getHubEntriesByCategory,
    getHubEntryBySlug,
    getHubRecommendations,
    getHubEntrySlugs,
    getHubCategories,
    getHubCategoryBySlug,
    getHubCategorySlugs,
}
