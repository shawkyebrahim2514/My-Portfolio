// https://vike.dev/onBeforePrerenderStart
export { onBeforePrerenderStart };

import { getHubLibraryCollectionSlugs } from '../../../../src/APIs';

async function onBeforePrerenderStart() {
    const slugs = await getHubLibraryCollectionSlugs();
    return slugs.filter(Boolean).map((slug: string) => `/hub/library/${slug}`);
}
