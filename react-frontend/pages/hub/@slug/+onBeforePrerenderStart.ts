// https://vike.dev/onBeforePrerenderStart
export { onBeforePrerenderStart };

import { getHubEntrySlugs } from '../../../src/APIs';

async function onBeforePrerenderStart() {
    const slugs = await getHubEntrySlugs();
    return slugs.map((slug: string) => `/hub/${slug}`);
}
