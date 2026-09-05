import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import RichContent from './index';
import type { RichContentNode, RichBlock, RichSpan, RichSpacer, RichMarkDef } from '../../Types';

// Small builders mirroring the exact shape produced by
// sanity-backend/scripts/migrate-to-portable-text.mjs, so these fixtures
// double as a regression check against the real migration output shape.
let seq = 0;
const key = () => `k${++seq}`;

function span(text: string, marks: string[] = []): RichSpan {
    return { _type: 'span', _key: key(), text, marks };
}

function spacer(kind: 'gap' | 'newline'): RichSpacer {
    return { _type: 'spacer', _key: key(), kind };
}

function block(
    children: (RichSpan | RichSpacer)[],
    opts: { style?: RichBlock['style']; listItem?: 'bullet'; markDefs?: RichMarkDef[] } = {}
): RichContentNode {
    return {
        _type: 'block',
        _key: key(),
        style: opts.style ?? 'normal',
        listItem: opts.listItem,
        markDefs: opts.markDefs ?? [],
        children,
    } as RichContentNode;
}

const renderValue = (value: RichContentNode[]) => render(<RichContent value={value} />).container;

describe('RichContent — Portable Text renderer', () => {
    it('buttonBadge decorator renders a button with the label', () => {
        const c = renderValue([block([span('Click Me', ['buttonBadge'])])]);
        const btn = c.querySelector('button');
        expect(btn).not.toBeNull();
        expect(btn?.textContent).toBe('Click Me');
    });

    it('gap spacer renders an inline <span>, never nested inside another block element', () => {
        const c = renderValue([block([span('left'), spacer('gap'), span('right')])]);
        const gap = c.querySelector('span');
        expect(gap).not.toBeNull();
        expect(c.querySelector('p p')).toBeNull();
    });

    it('newline spacer renders an inline <span> spacer', () => {
        const c = renderValue([block([span('top'), spacer('newline'), span('bottom')])]);
        expect(c.textContent).toContain('top');
        expect(c.textContent).toContain('bottom');
        expect(c.querySelector('p p')).toBeNull();
    });

    it('h1 style renders an <h1> with the heading style class', () => {
        const c = renderValue([block([span('My Title')], { style: 'h1' })]);
        const h1 = c.querySelector('h1');
        expect(h1?.textContent).toBe('My Title');
        expect(h1?.className).toMatch(/h1/);
    });

    it('alignCenter mark keeps BOTH the heading style and the alignment class on the block wrapper', () => {
        const c = renderValue([block([span('My Title', ['alignCenter'])], { style: 'h1' })]);
        const h1 = c.querySelector('h1');
        expect(h1).not.toBeNull();
        expect(h1?.textContent).toBe('My Title');
        expect(h1?.className).toMatch(/h1/);
        expect(h1?.className).toMatch(/alignCenter/);
    });

    it('bullet list items render <li> elements', () => {
        const c = renderValue([
            block([span('first')], { listItem: 'bullet' }),
            block([span('second')], { listItem: 'bullet' }),
        ]);
        const items = c.querySelectorAll('li');
        expect(items).toHaveLength(2);
        expect(items[0].textContent).toBe('first');
    });

    it('highlightSecondary decorator renders a secondary highlighted text span', () => {
        const c = renderValue([block([span('hot', ['highlightSecondary'])])]);
        const el = c.querySelector('[class*="highlightTextSecondary"]');
        expect(el).not.toBeNull();
        expect(el?.textContent).toBe('hot');
    });

    it('highlightAreaBase decorator renders a base highlight-area span', () => {
        const c = renderValue([block([span('area', ['highlightAreaBase'])])]);
        const el = c.querySelector('[class*="highlightAreaBase"]');
        expect(el).not.toBeNull();
        expect(el?.textContent).toBe('area');
    });

    it('highlightAreaSecondary decorator renders a secondary highlight-area span', () => {
        const c = renderValue([block([span('wow', ['highlightAreaSecondary'])])]);
        const el = c.querySelector('[class*="highlightAreaSecondary"]');
        expect(el).not.toBeNull();
        expect(el?.textContent).toBe('wow');
    });

    it('a heading whose sole span combines a highlight decorator AND a link mark keeps BOTH the highlight styling and the real link', () => {
        // Mirrors real production content: `##### **!-[Title](url)-!**` inside
        // a popup callout — a single span carrying ["highlightAreaSecondary", linkKey].
        const c = renderValue([
            block([span('Clarity Flutter SDK', ['highlightAreaSecondary', 'm1'])], {
                style: 'h5',
                markDefs: [{ _type: 'link', _key: 'm1', href: 'https://example.com' }],
            }),
        ]);
        const heading = c.querySelector('h5');
        expect(heading).not.toBeNull();
        // The highlight decorator's class must still wrap the link content.
        const highlighted = heading?.querySelector('[class*="highlightAreaSecondary"]');
        expect(highlighted).not.toBeNull();
        // A real, working anchor must still be present (not a plain <span>).
        const a = heading?.querySelector('a[href="https://example.com"]');
        expect(a).not.toBeNull();
        expect(a?.textContent).toContain('Clarity Flutter SDK');
        // The plain inline-link styling (underline + secondary color) must
        // NOT be the one applied here — that's the old, undesired look.
        expect(heading?.querySelector('[class*="inlineLink"]')).toBeNull();
    });

    it('callout renders a bar-styled quote block with its nested body', () => {
        const c = renderValue([
            {
                _type: 'callout',
                _key: key(),
                style: 'plain',
                color: 'base',
                body: [block([span('Heads up')], { style: 'h5' }), block([span('body text')])],
            },
        ]);
        expect(c.querySelector('[class*="blockquote"]')).not.toBeNull();
        expect(c.textContent).toContain('Heads up');
        expect(c.textContent).toContain('body text');
    });

    it('note renders its title, tone label, and nested body', () => {
        const c = renderValue([
            {
                _type: 'note',
                _key: key(),
                tone: 'tip',
                title: 'Keep the feedback loop short',
                body: [block([span('Validate changes while the context is fresh.')])],
            },
        ]);
        expect(c.querySelector('aside')).not.toBeNull();
        expect(c.textContent).toContain('Tip');
        expect(c.textContent).toContain('Keep the feedback loop short');
        expect(c.textContent).toContain('Validate changes while the context is fresh.');
    });

    it('key takeaways renders its heading and checklist items', () => {
        const c = renderValue([
            {
                _type: 'keyTakeaways',
                _key: key(),
                title: 'What to remember',
                items: [
                    'Validate the behavior, not only the build.',
                    'Keep the authoring flow focused.',
                ],
            },
        ]);
        expect(c.querySelector('section[aria-label="What to remember"]')).not.toBeNull();
        expect(c.querySelectorAll('li')).toHaveLength(2);
        expect(c.textContent).toContain('Validate the behavior, not only the build.');
        expect(c.textContent).toContain('Keep the authoring flow focused.');
    });

    it('quote renders its attribution with a safe source link', () => {
        const c = renderValue([
            {
                _type: 'quote',
                _key: key(),
                text: 'Simplicity is prerequisite for reliability.',
                author: 'Edsger W. Dijkstra',
                source: 'EWD 498',
                sourceUrl: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD498.html',
            },
        ]);
        expect(c.querySelector('blockquote')?.textContent).toContain('Simplicity is prerequisite');
        const source = c.querySelector('a[href*="EWD498.html"]');
        expect(source?.getAttribute('target')).toBe('_blank');
        expect(source?.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('expandable details renders a native open disclosure with its rich body', () => {
        const c = renderValue([
            {
                _type: 'expandableDetails',
                _key: key(),
                summary: 'Implementation notes',
                openByDefault: true,
                body: [block([span('This remains available to readers who want more context.')])],
            },
        ]);
        const details = c.querySelector('details');
        expect(details?.open).toBe(true);
        expect(details?.querySelector('summary')?.textContent).toContain('Implementation notes');
        expect(details?.textContent).toContain('This remains available to readers');
    });

    it('curated video keeps rich companion content attached beneath the video', () => {
        const c = renderValue([
            {
                _type: 'curatedVideo',
                _key: key(),
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                caption: 'A useful walkthrough.',
                featured: true,
                videoTitle: 'System design walkthrough',
                companionContent: [
                    {
                        _type: 'expandableDetails',
                        _key: key(),
                        summary: 'My notes',
                        body: [block([span('Focus on the trade-offs between consistency and availability.')])],
                    },
                ],
            },
        ]);
        expect(c.querySelector('section[aria-label*="System design walkthrough"]')).not.toBeNull();
        expect(c.textContent).toContain('Featured video');
        expect(c.textContent).toContain('Notes and context');
        expect(c.querySelector('details')?.textContent).toContain('My notes');
        expect(c.textContent).toContain('trade-offs between consistency and availability');
    });

    it('does not duplicate a YouTube caption when metadata is unavailable', () => {
        const caption = 'Why this video is worth watching.';
        const c = renderValue([
            {
                _type: 'youtube',
                _key: key(),
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                caption,
            },
        ]);
        expect(c.textContent?.split(caption)).toHaveLength(2);
    });

    it('popup callout renders via MainSection (no bar element)', () => {
        const c = renderValue([
            {
                _type: 'callout',
                _key: key(),
                style: 'popup',
                color: 'base',
                body: [block([span('popup body')])],
            },
        ]);
        expect(c.textContent).toContain('popup body');
        expect(c.querySelector('[class*="blockquote"]')).toBeNull();
    });

    it('buttonLink annotation on a standalone paragraph renders a real anchor with an icon (not a synthetic button)', () => {
        const c = renderValue([
            block([span('Google', ['m1'])], {
                markDefs: [
                    { _type: 'buttonLink', _key: 'm1', href: 'https://google.com', icon: 'link' },
                ],
            }),
        ]);
        const a = c.querySelector('a');
        expect(a).not.toBeNull();
        expect(a?.getAttribute('href')).toBe('https://google.com');
        expect(a?.textContent).toContain('Google');
        expect(a?.querySelector('svg')).not.toBeNull();
        expect(c.querySelector('button')).toBeNull();
        // Button is a real <button> (browsers never underline those), but
        // ButtonLink reuses its classes on a real <a> — must explicitly
        // suppress the browser-default anchor underline.
        expect(a?.className).toMatch(/noUnderline/);
    });

    it('a standalone link annotation renders a Header link, not nested inside a <p>', () => {
        const c = renderValue([
            block([span('Google', ['m1'])], {
                markDefs: [{ _type: 'link', _key: 'm1', href: 'https://google.com' }],
            }),
        ]);
        expect(c.textContent).toContain('Google');
        const a = c.querySelector('a[href="https://google.com"]');
        expect(a).not.toBeNull();
        expect(c.querySelector('p a')).toBeNull();
    });

    it('divider renders a real semantic <hr> element', () => {
        const c = renderValue([
            block([span('above')]),
            { _type: 'divider', _key: key() },
            block([span('below')]),
        ]);
        expect(c.querySelector('hr')).not.toBeNull();
    });

    it('imageRow renders images with alt/src, lazy-loaded, without nesting inside a <p>', () => {
        const c = renderValue([
            {
                _type: 'imageRow',
                _key: key(),
                align: 'center',
                images: [
                    {
                        _type: 'image',
                        _key: key(),
                        asset: {
                            _type: 'reference',
                            _ref: 'image-abc123def456abc123def456abc123def456ab-100x80-png',
                        },
                        alt: 'a cat',
                        maxWidth: 100,
                        maxHeight: 80,
                    },
                ],
            },
        ]);
        const img = c.querySelector('img');
        expect(img).not.toBeNull();
        expect(img?.getAttribute('alt')).toBe('a cat');
        expect(img?.getAttribute('src')).toContain('abc123def456abc123def456abc123def456ab');
        expect(img?.getAttribute('loading')).toBe('lazy');
        expect(img?.getAttribute('decoding')).toBe('async');
        expect(img?.closest('p')).toBeNull();

        const row = c.querySelector('[class*="imageRow"]');
        expect(row?.className).toMatch(/imageRowCenter/);
        const frame = c.querySelector('[class*="imageFrame"]');
        const frameStyle = frame?.getAttribute('style') ?? '';
        expect(frameStyle).toContain('--md-image-max-w');
        expect(frameStyle).toContain('--md-image-max-h');
    });

    it('imageRow supports an imported external image with an accessible caption', () => {
        const c = renderValue([
            {
                _type: 'imageRow',
                _key: key(),
                images: [
                    {
                        _type: 'externalImage',
                        _key: key(),
                        asset: {
                            _type: 'image',
                            asset: {
                                _type: 'reference',
                                _ref: 'image-05a17cb2c95b83d85d227b8fe37e8440-1200x800-png',
                            },
                        },
                        alt: 'System architecture diagram',
                        caption: 'Request flow',
                    },
                ],
                caption: 'Architecture overview',
            },
        ]);
        const image = c.querySelector('img');
        expect(image?.getAttribute('src')).toContain(
            '05a17cb2c95b83d85d227b8fe37e8440-1200x800.png'
        );
        expect(image?.getAttribute('alt')).toBe('System architecture diagram');
        expect(c.textContent).toContain('Request flow');
        expect(c.textContent).toContain('Architecture overview');
    });

    it('figure renders an external image with its caption and credit', () => {
        const c = renderValue([
            {
                _type: 'figure',
                _key: key(),
                sourceType: 'external',
                externalImage: {
                    _type: 'externalImage',
                    _key: key(),
                    asset: {
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: 'image-05a17cb2c95b83d85d227b8fe37e8440-1200x800-png',
                        },
                    },
                    alt: 'A performance chart',
                },
                caption: 'Cold-start time after the optimization.',
                credit: 'Internal benchmark',
                creditUrl: 'https://example.com/benchmark',
            },
        ]);
        const image = c.querySelector('img');
        expect(image?.getAttribute('src')).toContain(
            '05a17cb2c95b83d85d227b8fe37e8440-1200x800.png'
        );
        expect(image?.getAttribute('alt')).toBe('A performance chart');
        expect(c.textContent).toContain('Cold-start time after the optimization.');
        expect(c.querySelector('a[href="https://example.com/benchmark"]')).not.toBeNull();
    });

    it('link previews render a complete external-link card', () => {
        const c = renderValue([
            {
                _type: 'linkPreview',
                _key: key(),
                url: 'https://example.com/article',
                title: 'Useful article',
                description: 'A concise summary.',
                siteName: 'Example',
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: 'image-05a17cb2c95b83d85d227b8fe37e8440-1200x800-png',
                    },
                },
            },
        ]);
        const link = c.querySelector('a[href="https://example.com/article"]');
        expect(link).not.toBeNull();
        expect(link?.textContent).toContain('Useful article');
        expect(link?.textContent).toContain('A concise summary.');
        expect(link?.querySelector('img')?.getAttribute('src')).toContain(
            '05a17cb2c95b83d85d227b8fe37e8440-1200x800.png'
        );
    });

    it('groups consecutive link previews into a responsive resource grid', () => {
        const c = renderValue([
            {
                _type: 'linkPreview',
                _key: key(),
                url: 'https://example.com/one',
                title: 'First resource',
            },
            {
                _type: 'linkPreview',
                _key: key(),
                url: 'https://example.com/two',
                title: 'Second resource',
            },
        ]);

        const grid = c.querySelector('[class*="linkPreviewGrid"]');
        expect(grid).not.toBeNull();
        expect(grid?.querySelectorAll('a')).toHaveLength(2);
    });

    it('renders consecutive Facebook resources in their dedicated grid', () => {
        const c = renderValue([
            {
                _type: 'facebookResource',
                _key: key(),
                url: 'https://www.facebook.com/reel/123/',
                resourceType: 'reel',
                title: 'A useful parenting lesson',
                creator: 'Example Creator',
                commentary: 'Why this is worth sharing.',
                thumbnailSource: 'none',
            },
            {
                _type: 'facebookResource',
                _key: key(),
                url: 'https://www.facebook.com/posts/456/',
                resourceType: 'post',
                title: 'A thoughtful post',
                featured: true,
            },
        ]);

        const grid = c.querySelector('[class*="facebookResourceGrid"]');
        expect(grid).not.toBeNull();
        expect(grid?.querySelectorAll('a')).toHaveLength(2);
        expect(grid?.textContent).toContain('Reel');
        expect(grid?.textContent).toContain('Example Creator');
        expect(grid?.querySelector('[class*="featured"]')).not.toBeNull();
    });
});
