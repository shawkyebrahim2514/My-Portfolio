import { SanityHubPage, SanityHubEntry, SanityHubEntrySummary, SanityHubCategory } from '../../Types';
import sanityClient from './client';

// Shared projection for card/list rendering — deliberately excludes
// `body`/`tags`, which are only needed on the /hub/[slug] detail page, to
// keep the /hub index + category listing queries light.
const entrySummaryProjection = `{
    title,
    "slug": slug.current,
    kind,
    excerpt,
    "coverImage": coverImage.asset->url,
    sourceThumbnail,
    sourceName,
    durationLabel,
    externalUrl,
    publishedAt,
    featured,
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
        excerpt,
        "coverImage": coverImage.asset->url,
        sourceThumbnail,
        sourceName,
        durationLabel,
        externalUrl,
        publishedAt,
        featured,
        tags,
        body,
        "categories": categories[]->{ title, "slug": slug.current }
    }`;
    const result: SanityHubEntry = await sanityClient.fetch(query, { slug });
    return result;
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
        "icon": icon.asset->url
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
        "icon": icon.asset->url
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
    getHubEntrySlugs,
    getHubCategories,
    getHubCategoryBySlug,
    getHubCategorySlugs,
}
