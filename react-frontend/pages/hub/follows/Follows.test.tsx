import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { HubChannelsDirectoryData } from './+data';
import Follows from './+Page';

let data: HubChannelsDirectoryData;
vi.mock('vike-react/useData', () => ({ useData: () => data }));

beforeEach(() => {
    data = {
        categories: [],
        page: {
            title: { highlightedText: 'Follows', subText: 'Resources' },
            intro: [],
            channels: Array.from({ length: 14 }, (_, index) => ({
                _key: `channel-${index}`,
                type: index === 13 ? 'creator' : 'subscription',
                platform: index === 13 ? 'github' : 'youtube',
                name: `Resource ${index}`,
                url: `https://example.com/resource-${index}`,
                note: 'Recommended',
                categories: [],
            })),
        },
    };
});

afterEach(() => window.history.replaceState(null, '', '/hub/follows'));

describe('Progressive Follows discovery', () => {
    it('includes both directory types and entries beyond the first client page in server HTML', () => {
        const html = renderToStaticMarkup(<Follows />);
        expect(html).toContain('href="https://example.com/resource-12"');
        expect(html).toContain('href="https://example.com/resource-13"');
    });

    it('selects the nonempty directory when no subscriptions exist', () => {
        data.page.channels = data.page.channels.filter((channel) => channel.type === 'creator');
        render(<Follows />);
        expect(screen.getByRole('button', { name: /Creators/ })).toHaveAttribute(
            'aria-pressed',
            'true'
        );
        expect(screen.queryByRole('button', { name: /Subscriptions/ })).not.toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Resource 13/ })).toBeInTheDocument();
    });
});
