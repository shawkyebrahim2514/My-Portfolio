import type { PageContextServer } from 'vike/types';
import { render } from 'vike/abort';
import { useConfig } from 'vike-react/useConfig';
import { getHubCategoryBySlug, getHubEntries, getHubCategories } from '../../../../src/APIs';
import type { SanityHubCategory, SanityHubEntrySummary } from '../../../../src/Types';

export type HubCategoryData = {
    category: SanityHubCategory;
    entries: SanityHubEntrySummary[];
    categories: SanityHubCategory[];
};

export async function data(pageContext: PageContextServer): Promise<HubCategoryData> {
    // useConfig() must be called before any `await` — same Vike universal-hook
    // pattern as Hub entry pages. Not a React hook.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const config = useConfig();
    const { slug } = pageContext.routeParams;
    const [category, entries, categories] = await Promise.all([
        getHubCategoryBySlug(slug),
        getHubEntries(),
        getHubCategories(),
    ]);

    if (!category) {
        throw render(404, `Hub category not found: ${slug}`);
    }

    config({
        title: `${category.title} — Hub — Shawky Ebrahim`,
        description:
            category.description ||
            `Content in ${category.title} shared by Shawky Ebrahim.`,
    });

    return { category, entries, categories };
}
