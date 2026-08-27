import { describe, expect, it } from 'vitest';
import { buildSitemapXml, collectSitemapPaths, sitemapPriority } from './sitemap';
import { canonicalUrl, isHubEntryPath } from './site';

describe('collectSitemapPaths', () => {
    it('includes static routes, categories, and public entries once', () => {
        const paths = collectSitemapPaths({
            categorySlugs: ['engineering', 'engineering', ''],
            entrySlugs: ['clean-architecture', 'notes'],
        });

        expect(paths).toEqual([
            '/',
            '/skills',
            '/education',
            '/experience',
            '/projects',
            '/contacts',
            '/hub',
            '/hub/follows',
            '/hub/category/engineering',
            '/hub/clean-architecture',
            '/hub/notes',
        ]);
    });
});

describe('buildSitemapXml', () => {
    it('emits loc and priority for each path', () => {
        const xml = buildSitemapXml(['/', '/hub', '/hub/notes']);
        expect(xml).toContain('<loc>https://shawkyebrahim.vercel.app/</loc>');
        expect(xml).toContain('<priority>1.0</priority>');
        expect(xml).toContain('<loc>https://shawkyebrahim.vercel.app/hub</loc>');
        expect(xml).toContain('<loc>https://shawkyebrahim.vercel.app/hub/notes</loc>');
        expect(sitemapPriority('/hub/follows')).toBe('0.9');
        expect(sitemapPriority('/skills')).toBe('0.8');
        expect(sitemapPriority('/hub/notes')).toBe('0.7');
    });
});

describe('canonicalUrl', () => {
    it('normalizes trailing slashes', () => {
        expect(canonicalUrl('/')).toBe('https://shawkyebrahim.vercel.app/');
        expect(canonicalUrl('/hub/')).toBe('https://shawkyebrahim.vercel.app/hub');
        expect(isHubEntryPath('/hub/notes')).toBe(true);
        expect(isHubEntryPath('/hub/follows')).toBe(false);
        expect(isHubEntryPath('/hub/category/eng')).toBe(false);
    });
});
