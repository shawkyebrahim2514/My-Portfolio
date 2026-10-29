import { describe, expect, it } from 'vitest';
import { sanityImageProps } from './sanityImage';

const portrait = 'https://cdn.sanity.io/images/project/production/abc123-1536x2048.jpg';

describe('Sanity image delivery', () => {
    it('resizes a large avatar without server-side cropping and reserves its intrinsic ratio', () => {
        const props = sanityImageProps(portrait, 192, '96px');
        const url = new URL(props.src);

        expect(url.searchParams.get('w')).toBe('192');
        expect(url.searchParams.get('auto')).toBe('format');
        expect(url.searchParams.get('fit')).toBe('max');
        expect(url.searchParams.has('h')).toBe(false);
        expect(url.searchParams.has('rect')).toBe(false);
        expect(props).toMatchObject({ width: 1536, height: 2048, sizes: '96px' });
        expect(props.srcSet).toContain(' 96w');
        expect(props.srcSet).toContain(' 192w');
    });

    it('caps responsive candidates at the original width instead of upscaling small assets', () => {
        const src = portrait.replace('1536x2048', '80x120');
        const props = sanityImageProps(src, 192, '48px');

        expect(new URL(props.src).searchParams.get('w')).toBe('80');
        expect(props.srcSet?.split(', ').map((candidate) => candidate.split(' ').at(-1))).toEqual([
            '48w',
            '80w',
        ]);
    });

    it.each([
        'https://i.ytimg.com/vi/example/hqdefault.jpg',
        'https://example.com/image.jpg',
        portrait.replace('cdn.sanity.io', 'cdn.sanity.io.example.com'),
        '/images/placeholder.png',
        portrait.replace('.jpg', '.svg'),
        `${portrait}?rect=0,0,500,500&w=200&h=200&fit=crop`,
    ])('preserves external or custom-transformed image URLs: %s', (src) => {
        expect(sanityImageProps(src, 640, '100vw')).toEqual({ src });
    });

    it('rejects invalid delivery sizes explicitly', () => {
        expect(() => sanityImageProps(portrait, 0, '48px')).toThrow(RangeError);
    });
});
