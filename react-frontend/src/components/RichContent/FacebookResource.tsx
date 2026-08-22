import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUpRightFromSquare} from '@fortawesome/free-solid-svg-icons';
import {faFacebook} from '@fortawesome/free-brands-svg-icons';
import type {RichFacebookResource} from '../../Types';
import {cx} from '../../utils/cx';
import {urlForImage} from './utils';
import styles from './FacebookResource.module.css';

const TYPE_LABELS: Record<RichFacebookResource['resourceType'], string> = {
    reel: 'Reel',
    video: 'Video',
    post: 'Post',
    photo: 'Photo',
    article: 'Article',
};

export default function FacebookResource({value}: {value: RichFacebookResource}) {
    const thumbnail =
        value.thumbnailSource === 'sanity' && value.thumbnail
            ? urlForImage(value.thumbnail.asset)
            : value.thumbnailUrl;

    return (
        <a
            className={cx(styles.card, value.featured && styles.featured)}
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
        >
            {thumbnail && (
                <img
                    className={styles.thumbnail}
                    src={thumbnail}
                    alt=""
                    loading="lazy"
                    decoding="async"
                />
            )}
            <span className={styles.content}>
                <span className={styles.meta}>
                    <span className={styles.platform}>
                        <FontAwesomeIcon icon={faFacebook} />
                        Facebook
                    </span>
                    <span className={styles.type}>{TYPE_LABELS[value.resourceType]}</span>
                </span>
                <strong className={styles.title} dir="auto">{value.title}</strong>
                {value.creator && <span className={styles.creator} dir="auto">{value.creator}</span>}
                {value.commentary && (
                    <span className={styles.commentary} dir="auto">{value.commentary}</span>
                )}
            </span>
            <FontAwesomeIcon
                className={styles.icon}
                icon={faArrowUpRightFromSquare}
                aria-hidden="true"
            />
        </a>
    );
}
