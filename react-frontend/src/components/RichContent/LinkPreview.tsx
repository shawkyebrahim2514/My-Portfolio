import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faLink } from '@fortawesome/free-solid-svg-icons';
import type { RichLinkPreview } from '../../Types';
import { cx } from '../../utils/cx';
import styles from './LinkPreview.module.css';

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

    return (
        <a
            className={cx(
                styles.card,
                compact && styles.compact,
                !value.imageUrl && styles.noImage
            )}
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
        >
            {value.imageUrl && (
                <img className={styles.image} src={value.imageUrl} alt="" loading="lazy" />
            )}
            <span className={styles.content}>
                <span className={styles.publisher}>
                    {value.faviconUrl ? (
                        <img src={value.faviconUrl} alt="" width={16} height={16} loading="lazy" />
                    ) : (
                        <FontAwesomeIcon icon={faLink} />
                    )}
                    {value.siteName ?? host}
                </span>
                <strong className={styles.title} dir="auto">{title}</strong>
                {value.description && (
                    <span className={styles.description} dir="auto">{value.description}</span>
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
