import { cx } from '../../utils/cx';
import type { RichImageRow, RichMediaImage } from '../../Types';
import { imageFrameVars, imageRowAlignClass, urlForImage } from './utils';
import styles from './RichContent.module.css';

type ImageRowProps = {
    readonly value: RichImageRow;
};

function imageUrl(image: RichMediaImage): string {
    return image._type === 'externalImage' ? image.url : urlForImage(image.asset);
}

// Renders the `imageRow` block object — replaces the old `![alt](url =WxH|align)`
// image DSL. Layout lives entirely in CSS; only per-image pixel dimensions
// (when authored) are passed inline as CSS custom properties.
export default function ImageRow({ value }: ImageRowProps) {
    return (
        <div
            className={cx(styles.imageRow, imageRowAlignClass(value.align, styles))}
            data-image-count={value.images.length}
        >
            {value.images.map((image) => (
                <figure
                    key={image._key}
                    className={styles.imageFrame}
                    style={imageFrameVars(image.maxWidth, image.maxHeight)}
                >
                    <img
                        src={imageUrl(image)}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className={styles.image}
                    />
                    {image.caption && (
                        <figcaption className={styles.imageCaption}>{image.caption}</figcaption>
                    )}
                </figure>
            ))}
            {value.caption && <span className={styles.rowCaption}>{value.caption}</span>}
        </div>
    );
}
