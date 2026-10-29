import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faLink } from '@fortawesome/free-solid-svg-icons';
import type { RichLinkPreview } from '../../Types';
import { cx } from '../../utils/cx';
import { urlForImage } from './utils';
import styles from './LinkPreview.module.css';
import { sanityImageProps } from '../../utils/sanityImage';

type LinkPreviewProps = {
    value: RichLinkPreview;
    compact?: boolean;
};

export default function LinkPreview({ value, compact = false }: LinkPreviewProps) {
    const host = (() => {
        try {
            return new URL(value.url).hostname.replace(/^www\./, '');
        } catch {
            return value.url;
        }
    })();
    const title = value.title ?? host;
    const imageUrl = value.image?.asset?._ref ? urlForImage(value.image.asset) : undefined;
    const faviconUrl = value.favicon?.asset?._ref ? urlForImage(value.favicon.asset) : undefined;

    return (
        <a
            className={cx(styles.card, compact && styles.compact, !imageUrl && styles.noImage)}
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
        >
            {imageUrl && (
                <img
                    className={styles.image}
                    {...sanityImageProps(
                        imageUrl,
                        1280,
                        '(max-width: 768px) calc(100vw - 64px), 480px'
                    )}
                    alt=""
                    loading="lazy"
                    decoding="async"
                />
            )}
            <span className={styles.content}>
                <span className={styles.publisher}>
                    {faviconUrl ? (
                        <img
                            {...sanityImageProps(faviconUrl, 48, '16px')}
                            alt=""
                            width={16}
                            height={16}
                            loading="lazy"
                        />
                    ) : (
                        <FontAwesomeIcon icon={faLink} />
                    )}
                    {value.siteName ?? host}
                </span>
                <strong className={styles.title} dir="auto">
                    {title}
                </strong>
                {value.description && (
                    <span className={styles.description} dir="auto">
                        {value.description}
                    </span>
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
