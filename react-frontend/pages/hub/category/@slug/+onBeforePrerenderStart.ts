// https://vike.dev/onBeforePrerenderStart
export { onBeforePrerenderStart };

import { getHubCategorySlugs } from '../../../../src/APIs';

async function onBeforePrerenderStart() {
    const slugs = await getHubCategorySlugs();
    return slugs.map((slug: string) => `/hub/category/${slug}`);
}
