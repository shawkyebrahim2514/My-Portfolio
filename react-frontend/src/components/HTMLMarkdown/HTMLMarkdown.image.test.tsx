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
});
