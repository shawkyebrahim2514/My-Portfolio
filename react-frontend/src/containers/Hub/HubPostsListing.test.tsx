import { fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import type { SanityHubCategory, SanityHubEntrySummary } from '../../Types';
import HubPostsListing from './HubPostsListing';

const categories: SanityHubCategory[] = [
    { title: 'Populated', slug: 'populated', accentColor: 'base' },
    { title: 'Empty', slug: 'empty', accentColor: 'base' },
];
const entries: SanityHubEntrySummary[] = Array.from({ length: 14 }, (_, index) => ({
    title: `Entry ${index}`,
    slug: `entry-${index}`,
    kind: 'article',
    excerpt: 'A useful resource',
    publishedAt: '2026-07-04T22:30:00Z',
    featured: false,
    categories: [categories[0]],
}));

afterEach(() => window.history.replaceState(null, '', '/hub'));

describe('Hub discovery', () => {
    it('keeps every resource reachable in server HTML without JavaScript pagination', () => {
        const html = renderToStaticMarkup(
            <HubPostsListing entries={entries} categories={categories} />
        );
        expect(html).toContain('href="/hub/entry-13"');
        expect(html).not.toContain('Load 2 more');
        expect(html).not.toContain('href="/hub/category/empty"');
    });

    it('progressively paginates and resets the page when a search narrows the results', () => {
        render(<HubPostsListing entries={entries} categories={categories} />);
        expect(screen.queryByRole('link', { name: /Entry 13/ })).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Load 2 more' }));
        expect(screen.getByRole('link', { name: /Entry 13/ })).toBeInTheDocument();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Search Hub posts' }), {
            target: { value: 'Entry 13' },
        });
        expect(screen.getByText('Showing 1 of 1')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Entry 0 / })).not.toBeInTheDocument();
    });

    it('preserves unrelated URL parameters and history state while updating filters', () => {
        window.history.replaceState({ position: 2 }, '', '/hub?preview=1&utm_source=test');
        const { container } = render(<HubPostsListing entries={entries} categories={categories} />);
        fireEvent.click(screen.getByRole('button', { name: /Articles/ }));
        expect(screen.getByRole('button', { name: /Articles/ })).toHaveAttribute(
            'aria-pressed',
            'true'
        );
        const params = new URLSearchParams(window.location.search);
        expect(params.get('type')).toBe('article');
        expect(params.get('preview')).toBe('1');
        expect(params.get('utm_source')).toBe('test');
        expect(window.history.state).toEqual({ position: 2 });
        expect(
            container.querySelector('a[href^="/hub/category/populated"]')?.getAttribute('href')
        ).toContain('preview=1');
    });

    it('retains the active category even when it has no matching resources', () => {
        const { container } = render(
            <HubPostsListing entries={entries} categories={categories} activeSlug="empty" />
        );
        expect(container.querySelector('details')).toHaveAttribute('open');
        expect(screen.getByRole('link', { name: /Empty/ })).toHaveAttribute('aria-current', 'page');
    });
});
