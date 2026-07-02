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
    opts: { style?: RichBlock['style']; listItem?: 'bullet'; markDefs?: RichMarkDef[] } = {},
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

    it('popup callout renders via MainSection (no bar element)', () => {
        const c = renderValue([
            { _type: 'callout', _key: key(), style: 'popup', color: 'base', body: [block([span('popup body')])] },
        ]);
        expect(c.textContent).toContain('popup body');
        expect(c.querySelector('[class*="blockquote"]')).toBeNull();
    });

    it('buttonLink annotation on a standalone paragraph renders a real anchor with an icon (not a synthetic button)', () => {
        const c = renderValue([
            block([span('Google', ['m1'])], {
                markDefs: [{ _type: 'buttonLink', _key: 'm1', href: 'https://google.com', icon: 'link' }],
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
        const c = renderValue([block([span('above')]), { _type: 'divider', _key: key() }, block([span('below')])]);
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
                        asset: { _type: 'reference', _ref: 'image-abc123def456abc123def456abc123def456ab-100x80-png' },
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
});
