import { describe, expect, it } from 'vitest';
import { detectImageType } from './_image-type';
import { isPublicIp } from './_fetch-public-resource';

describe('detectImageType', () => {
    it('recognizes supported raster signatures', () => {
        expect(detectImageType(Buffer.from([0xff, 0xd8, 0xff, 0x00]))).toBe('image/jpeg');
        expect(
            detectImageType(
                Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
            )
        ).toBe('image/png');
        expect(detectImageType(Buffer.from('GIF89a'))).toBe('image/gif');
        expect(detectImageType(Buffer.from('RIFF0000WEBP'))).toBe('image/webp');
        expect(detectImageType(Buffer.from('0000ftypavif'))).toBe('image/avif');
    });

    it('rejects HTML and SVG content', () => {
        expect(detectImageType(Buffer.from('<html>not an image</html>'))).toBeUndefined();
        expect(detectImageType(Buffer.from('<svg><script /></svg>'))).toBeUndefined();
    });
});

describe('isPublicIp', () => {
    it('rejects private, metadata, mapped, and transition addresses', () => {
        expect(isPublicIp('127.0.0.1')).toBe(false);
        expect(isPublicIp('169.254.169.254')).toBe(false);
        expect(isPublicIp('::1')).toBe(false);
        expect(isPublicIp('::ffff:127.0.0.1')).toBe(false);
        expect(isPublicIp('::ffff:169.254.169.254')).toBe(false);
        expect(isPublicIp('64:ff9b::a9fe:a9fe')).toBe(false);
        expect(isPublicIp('2002:7f00:1::')).toBe(false);
    });

    it('accepts ordinary public IPv4 and IPv6 addresses', () => {
        expect(isPublicIp('1.1.1.1')).toBe(true);
        expect(isPublicIp('2606:4700:4700::1111')).toBe(true);
    });
});
