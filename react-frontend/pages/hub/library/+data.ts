import {
    getHubLibraryCollections,
    getHubLibraryPage,
    getHubLibrarySaves,
} from '../../../src/APIs';
import type { SanityHubLibraryCollection, SanityHubLibraryPage, SanityHubLibrarySave } from '../../../src/Types';

export type HubLibraryData = {
    page: SanityHubLibraryPage;
    collections: SanityHubLibraryCollection[];
    saves: SanityHubLibrarySave[];
};

const fallbackPage: SanityHubLibraryPage = {
    title: {
        highlightedText: 'Library',
        subText: 'Bookmarks I keep and why',
    },
    intro: [],
};

export async function data(): Promise<HubLibraryData> {
    const [page, collections, saves] = await Promise.all([
        getHubLibraryPage(),
        getHubLibraryCollections(),
        getHubLibrarySaves(),
    ]);

    return {
        page: {
            title: page?.title ?? fallbackPage.title,
            intro: page?.intro ?? fallbackPage.intro,
        },
        collections,
        saves,
    };
}
