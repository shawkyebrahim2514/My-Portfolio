import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import sanityClient from '../../APIs/Sanity/client';
import type { RichSpan, RichSpacer } from '../../Types';

const builder = createImageUrlBuilder(sanityClient);

// Builds a delivery URL for an `image` block's `asset` reference via
// Sanity's image-url builder (the idiomatic way to resolve Portable Text
// image references client-side, vs. projecting `asset->url` in every GROQ
// query).
export function urlForImage(source: SanityImageSource): string {
    return builder.image(source).url();
}

// Only genuinely dynamic values (user-specified pixel dimensions) are ever
// emitted inline, and only as CSS custom properties consumed by the
// stylesheet — mirrors the old customImage remark plugin's imageFrameVars.
export function imageFrameVars(maxWidth?: number, maxHeight?: number): React.CSSProperties {
    let width = '100%';
    let height = '100%';
    if (maxWidth && !maxHeight) {
        width = `min(100%, ${maxWidth}px)`;
    } else if (maxHeight && !maxWidth) {
        height = `${maxHeight}px`;
    } else if (maxWidth && maxHeight) {
        width = `min(100%, ${maxWidth}px)`;
        height = `min(100%, ${maxHeight}px)`;
    }
    return { '--md-image-max-w': width, '--md-image-max-h': height } as React.CSSProperties;
}

const ALIGN_MARKS = new Set(['alignLeft', 'alignCenter', 'alignRight']);

// The old [center]/[left]/[right] markers were block-wide, but Portable
// Text's native `block` type can't carry a custom field (see
// richContent.ts). The migration script instead applies an align decorator
// to every span in the block; find it here so the block-level wrapper can
// apply the matching text-align class to the whole block.
export function blockAlignClass(
    children: Array<RichSpan | RichSpacer> | undefined,
    classes: Record<string, string>,
): string | undefined {
    for (const child of children ?? []) {
        if (child._type !== 'span') continue;
        const mark = child.marks?.find((m) => ALIGN_MARKS.has(m));
        if (mark) return classes[mark];
    }
    return undefined;
}

export function imageRowAlignClass(align: string | undefined, classes: Record<string, string>): string {
    if (align === 'center') return classes.imageRowCenter;
    if (align === 'right') return classes.imageRowRight;
    return classes.imageRowLeft;
}
