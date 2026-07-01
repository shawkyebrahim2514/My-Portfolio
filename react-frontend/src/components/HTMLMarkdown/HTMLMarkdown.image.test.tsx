import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import HTMLMarkdown from './index';

describe('HTMLMarkdown — image rendering', () => {
    it('does not nest block elements inside <p> (valid DOM)', () => {
        const { container } = render(
            <HTMLMarkdown markdown={'![cat](/cat.png =100x80|center)'} />
        );
        // The image and its wrappers must not live inside a <p>.
        const img = container.querySelector('img');
        expect(img).not.toBeNull();
        expect(img?.closest('p')).toBeNull();
    });

    it('renders the image with its alt text and src', () => {
        const { container } = render(
            <HTMLMarkdown markdown={'![a cat](/cat.png =100x80|center)'} />
        );
        const img = container.querySelector('img');
        expect(img?.getAttribute('alt')).toBe('a cat');
        expect(img?.getAttribute('src')).toBe('/cat.png');
    });

    it('applies layout via classes; only pixel dimensions are inline (as CSS vars)', () => {
        const { container } = render(
            <HTMLMarkdown markdown={'![a cat](/cat.png =100x80|center)'} />
        );
        const row = container.querySelector('.md-image-row');
        expect(row).not.toBeNull();
        expect(row?.className).toContain('md-image-row--center');
        // Row carries no inline layout styles — those live in CSS.
        expect(row?.getAttribute('style')).toBeNull();

        const frame = container.querySelector('.md-image-frame');
        // The only inline styles are the dynamic dimension custom properties.
        const frameStyle = frame?.getAttribute('style') ?? '';
        expect(frameStyle).toContain('--md-image-max-w');
        expect(frameStyle).toContain('--md-image-max-h');
        expect(frameStyle).not.toContain('display');
        expect(frameStyle).not.toContain('flex');

        // The <img> itself has no inline style.
        expect(container.querySelector('img')?.getAttribute('style')).toBeNull();
    });
});
