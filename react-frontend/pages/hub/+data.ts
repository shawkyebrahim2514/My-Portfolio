import { getHubPage, getHubEntries, getHubCategories } from '../../src/APIs';
import type { SanityHubPage, SanityHubEntrySummary, SanityHubCategory } from '../../src/Types';

export type HubIndexData = {
    page: SanityHubPage;
    entries: SanityHubEntrySummary[];
    categories: SanityHubCategory[];
};

export async function data(): Promise<HubIndexData> {
    const [page, entries, categories] = await Promise.all([getHubPage(), getHubEntries(), getHubCategories()]);
    return { page, entries, categories };
}
