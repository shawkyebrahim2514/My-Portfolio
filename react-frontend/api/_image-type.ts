const IMAGE_TYPES = {
    avif: 'image/avif',
    gif: 'image/gif',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
} as const;

export type SupportedImageType = (typeof IMAGE_TYPES)[keyof typeof IMAGE_TYPES];

export function detectImageType(body: Buffer): SupportedImageType | undefined {
    if (
        body.length >= 3 &&
        body[0] === 0xff &&
        body[1] === 0xd8 &&
        body[2] === 0xff
    ) {
        return IMAGE_TYPES.jpeg;
    }
    if (
        body.length >= 8 &&
        body.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    ) {
        return IMAGE_TYPES.png;
    }
    if (body.length >= 6) {
        const signature = body.subarray(0, 6).toString('ascii');
        if (signature === 'GIF87a' || signature === 'GIF89a') return IMAGE_TYPES.gif;
    }
    if (
        body.length >= 12 &&
        body.subarray(0, 4).toString('ascii') === 'RIFF' &&
        body.subarray(8, 12).toString('ascii') === 'WEBP'
    ) {
        return IMAGE_TYPES.webp;
    }
    if (body.length >= 12 && body.subarray(4, 8).toString('ascii') === 'ftyp') {
        const brand = body.subarray(8, 12).toString('ascii');
        if (brand === 'avif' || brand === 'avis') return IMAGE_TYPES.avif;
    }
    return undefined;
}
