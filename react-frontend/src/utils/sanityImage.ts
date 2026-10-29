type ResponsiveImageProps = {
    src: string;
    srcSet?: string;
    sizes?: string;
    width?: number;
    height?: number;
};

const IMAGE_WIDTHS = [48, 96, 160, 240, 320, 480, 640, 960, 1280, 1920];
const SANITY_ASSET =
    /^https:\/\/cdn\.sanity\.io\/images\/[^/?#]+\/[^/?#]+\/[\w-]+-(\d+)x(\d+)\.(?:avif|jpe?g|png|webp)$/i;

export function sanityImageProps(
    src: string,
    maxWidth: number,
    sizes: string
): ResponsiveImageProps {
    if (!Number.isInteger(maxWidth) || maxWidth <= 0) {
        throw new RangeError('Image delivery width must be a positive integer');
    }

    // Leave third-party, vector, and already-transformed URLs unchanged.
    const asset = SANITY_ASSET.exec(src);
    if (!asset) return { src };

    const width = Number(asset[1]);
    const height = Number(asset[2]);
    if (width <= 0 || height <= 0) {
        throw new Error('Sanity image URL has invalid dimensions');
    }

    const largest = Math.min(maxWidth, width);
    const candidates = [...IMAGE_WIDTHS.filter((candidate) => candidate < largest), largest];
    const deliveryUrl = (candidate: number) => {
        const url = new URL(src);
        url.searchParams.set('w', String(candidate));
        url.searchParams.set('fit', 'max');
        url.searchParams.set('auto', 'format');
        return url.href;
    };

    return {
        src: deliveryUrl(largest),
        srcSet: candidates.map((candidate) => `${deliveryUrl(candidate)} ${candidate}w`).join(', '),
        sizes,
        width,
        height,
    };
}
