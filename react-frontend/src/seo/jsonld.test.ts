import { describe, expect, it } from 'vitest';
import { siteJsonLdGraph } from './jsonld';

describe('siteJsonLdGraph', () => {
    it('adds ProfilePage on the homepage', () => {
        const graph = siteJsonLdGraph('/')['@graph'] as { '@type': string }[];
        expect(graph.map((node) => node['@type'])).toEqual(['Person', 'WebSite', 'ProfilePage']);
    });

    it('adds BlogPosting for article entries', () => {
        const graph = siteJsonLdGraph('/hub/notes', {
            title: 'Notes',
            excerpt: 'A note',
            slug: 'notes',
            kind: 'article',
            language: 'en',
            publishedAt: '2026-01-01',
            tags: ['react'],
        })['@graph'] as { '@type': string }[];
        expect(graph.map((node) => node['@type'])).toEqual(['Person', 'WebSite', 'BlogPosting']);
    });
});
