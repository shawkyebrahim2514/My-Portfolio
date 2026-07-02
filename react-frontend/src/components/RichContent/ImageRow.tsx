import { cx } from '../../utils/cx';
import type { RichImageRow } from '../../Types';
import { imageFrameVars, imageRowAlignClass, urlForImage } from './utils';
import styles from './RichContent.module.css';

type ImageRowProps = {
    readonly value: RichImageRow;
};

// Renders the `imageRow` block object — replaces the old `![alt](url =WxH|align)`
// image DSL. Layout lives entirely in CSS; only per-image pixel dimensions
// (when authored) are passed inline as CSS custom properties.
export default function ImageRow({ value }: ImageRowProps) {
    return (
        <div className={cx(styles.imageRow, imageRowAlignClass(value.align, styles))}>
            {value.images.map((image) => (
                <div
                    key={image._key}
                    className={styles.imageFrame}
                    style={imageFrameVars(image.maxWidth, image.maxHeight)}
                >
                    <img
                        src={urlForImage(image.asset)}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className={styles.image}
                    />
                </div>
            ))}
        </div>
    );
}
