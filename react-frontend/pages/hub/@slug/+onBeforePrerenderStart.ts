// https://vike.dev/onBeforePrerenderStart
export { onBeforePrerenderStart };

import { getHubEntrySlugs } from '../../../src/APIs';

async function onBeforePrerenderStart() {
    const slugs = await getHubEntrySlugs();
    return slugs
        .filter((slug: string) => slug && slug !== 'follows' && slug !== 'library' && slug !== 'category')
        .map((slug: string) => `/hub/${slug}`);
}
