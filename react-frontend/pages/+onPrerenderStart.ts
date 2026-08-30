// After Vike knows every prerender URL, write a full sitemap into the
// client output so production includes Hub categories and public entries.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getHubCategorySlugs, getHubEntries, getHubLibrarySaves } from '../src/APIs';
import { buildSitemapXml, collectSitemapPaths } from '../src/seo/sitemap';

export async function onPrerenderStart() {
    const [entries, categories, librarySaves] = await Promise.all([
        getHubEntries(),
        getHubCategorySlugs(),
        getHubLibrarySaves(),
    ]);
    const libraryCollectionSlugs = [
        ...new Set(
            librarySaves
                .filter((save) => !save.hiddenInProduction && save.collection?.slug)
                .map((save) => save.collection!.slug),
        ),
    ];
    const paths = collectSitemapPaths({
        categorySlugs: categories.filter(Boolean),
        libraryCollectionSlugs,
        entrySlugs: entries
            .filter((entry) => !entry.hiddenInProduction && entry.slug)
            .map((entry) => entry.slug),
    });

    const outDir = join(process.cwd(), 'dist', 'client');
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'sitemap.xml'), buildSitemapXml(paths), 'utf8');
}
