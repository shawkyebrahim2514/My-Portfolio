import { getHubChannelsDirectoryPage, getHubCategories } from '../../../src/APIs';
import type { SanityHubChannelsDirectoryPage, SanityHubCategory } from '../../../src/Types';

export type HubChannelsDirectoryData = {
    page: SanityHubChannelsDirectoryPage;
    categories: SanityHubCategory[];
};

const fallbackDirectoryPage: SanityHubChannelsDirectoryPage = {
    title: {
        highlightedText: 'Follows',
        subText: 'People and channels I follow',
    },
    intro: [],
    channels: [],
};

export async function data(): Promise<HubChannelsDirectoryData> {
    const [page, categories] = await Promise.all([getHubChannelsDirectoryPage(), getHubCategories()]);
    return { page: page ?? fallbackDirectoryPage, categories };
}
