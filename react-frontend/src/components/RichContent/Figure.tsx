import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import type { RichFigure, RichMediaImage } from '../../Types';
import { urlForImage } from './utils';
import styles from './Figure.module.css';
import { cx } from '../../utils/cx';

function imageUrl(image: RichMediaImage): string {
    return image._type === 'externalImage' ? image.url : urlForImage(image.asset);
}

export default function Figure({ value }: { value: RichFigure }) {
    const image = value.sourceType === 'external' ? value.externalImage : value.image;
    if (!image) return null;
    const src = imageUrl(image);
    const hasCaption = Boolean(value.caption || value.credit || value.creditUrl);

    return (
        <figure className={styles.figure}>
            <div className={cx(styles.media, hasCaption && styles.mediaWithCaption)}>
                <img
                    className={styles.image}
                    src={src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                />
            </div>
            {hasCaption && (
                <figcaption className={styles.caption}>
                    {value.caption && <span className={styles.captionText}>{value.caption}</span>}
                    {(value.credit || value.creditUrl) && (
                        <span className={styles.credit}>
                            {value.creditUrl ? (
                                <a href={value.creditUrl} target="_blank" rel="noopener noreferrer">
                                    {value.credit ?? 'Image source'}{' '}
                                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                                </a>
                            ) : (
                                value.credit
                            )}
                        </span>
                    )}
                </figcaption>
            )}
        </figure>
    );
}
