import type { PageContextServer } from 'vike/types';
import { render } from 'vike/abort';
import { getHubCategoryBySlug, getHubEntriesByCategory, getHubCategories } from '../../../../src/APIs';
import type { SanityHubCategory, SanityHubEntrySummary } from '../../../../src/Types';

export type HubCategoryData = {
    category: SanityHubCategory;
    entries: SanityHubEntrySummary[];
    categories: SanityHubCategory[];
};

export async function data(pageContext: PageContextServer): Promise<HubCategoryData> {
    const { slug } = pageContext.routeParams;
    const [category, entries, categories] = await Promise.all([
        getHubCategoryBySlug(slug),
        getHubEntriesByCategory(slug),
        getHubCategories(),
    ]);

    if (!category) {
        throw render(404, `Hub category not found: ${slug}`);
    }

    return { category, entries, categories };
}
