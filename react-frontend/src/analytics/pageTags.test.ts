import { describe, expect, it } from 'vitest';
import { buildPageTags, pageArea } from './pageTags';

describe('pageArea', () => {
    it('maps portfolio and hub routes', () => {
        expect(pageArea('/')).toBe('about');
        expect(pageArea('/projects')).toBe('projects');
        expect(pageArea('/contacts')).toBe('contacts');
        expect(pageArea('/hub')).toBe('hub');
        expect(pageArea('/hub/')).toBe('hub');
        expect(pageArea('/hub/follows')).toBe('hub-follows');
        expect(pageArea('/hub/library')).toBe('hub-library');
        expect(pageArea('/hub/library/career')).toBe('hub-library-collection');
        expect(pageArea('/hub/category/engineering')).toBe('hub-category');
        expect(pageArea('/hub/clean-architecture')).toBe('hub-entry');
    });
});

describe('buildPageTags', () => {
    it('adds preview, hub kind, and follow filters', () => {
        expect(
            buildPageTags('/hub/follows', '?type=creators&source=youtube&category=engineering', {
                preview: true,
            }),
        ).toEqual({
            page: 'hub-follows',
            path: '/hub/follows',
            preview: 'true',
            hub_source: 'youtube',
            hub_type: 'creators',
            hub_category: 'engineering',
        });

        expect(buildPageTags('/hub/library/career')).toEqual({
            page: 'hub-library-collection',
            path: '/hub/library/career',
            hub_collection: 'career',
        });

        expect(buildPageTags('/hub/notes', '', { hubKind: 'article' })).toEqual({
            page: 'hub-entry',
            path: '/hub/notes',
            hub_kind: 'article',
        });
    });
});
