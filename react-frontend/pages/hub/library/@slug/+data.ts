import type { PageContextServer } from 'vike/types';
import { render } from 'vike/abort';
import { useConfig } from 'vike-react/useConfig';
import {
    getHubLibraryCollectionBySlug,
    getHubLibraryCollections,
    getHubLibrarySaves,
} from '../../../../src/APIs';
import type { SanityHubLibraryCollection, SanityHubLibrarySave } from '../../../../src/Types';

export type HubLibraryCollectionData = {
    collection: SanityHubLibraryCollection;
    collections: SanityHubLibraryCollection[];
    saves: SanityHubLibrarySave[];
};

export async function data(pageContext: PageContextServer): Promise<HubLibraryCollectionData> {
    // useConfig() must be called before any `await` — same Vike universal-hook
    // pattern as Hub entry pages. Not a React hook.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const config = useConfig();
    const { slug } = pageContext.routeParams;
    const [collection, collections, saves] = await Promise.all([
        getHubLibraryCollectionBySlug(slug),
        getHubLibraryCollections(),
        getHubLibrarySaves(),
    ]);

    if (!collection) {
        throw render(404, `Library collection not found: ${slug}`);
    }

    config({
        title: `${collection.title} — Library — Shawky Ebrahim`,
        description:
            collection.description ||
            `Bookmarks in ${collection.title} that I keep, with a note on why.`,
    });

    return { collection, collections, saves };
}
