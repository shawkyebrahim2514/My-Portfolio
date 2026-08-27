import { SITE_URL, STATIC_PATHS, canonicalUrl } from './site';

export type SitemapPathInput = {
    categorySlugs: string[];
    entrySlugs: string[];
};

export function collectSitemapPaths({ categorySlugs, entrySlugs }: SitemapPathInput): string[] {
    const seen = new Set<string>();
    const paths: string[] = [];

    const add = (path: string) => {
        const normalized = path.replace(/\/+$/, '') || '/';
        if (seen.has(normalized)) return;
        seen.add(normalized);
        paths.push(normalized);
    };

    for (const path of STATIC_PATHS) add(path);
    for (const slug of categorySlugs) {
        if (slug) add(`/hub/category/${slug}`);
    }
    for (const slug of entrySlugs) {
        if (slug) add(`/hub/${slug}`);
    }
    return paths;
}

export function sitemapPriority(path: string): string {
    if (path === '/') return '1.0';
    if (path === '/hub' || path === '/hub/follows') return '0.9';
    if (path.startsWith('/hub/')) return '0.7';
    return '0.8';
}

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export function buildSitemapXml(paths: string[], siteUrl = SITE_URL): string {
    const urls = paths
        .map((path) => {
            const loc = escapeXml(canonicalUrl(path, siteUrl));
            return `  <url><loc>${loc}</loc><priority>${sitemapPriority(path)}</priority></url>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

