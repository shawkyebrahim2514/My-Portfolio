import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faLink } from '@fortawesome/free-solid-svg-icons';
import type { RichLinkPreview } from '../../Types';
import styles from './LinkPreview.module.css';

export default function LinkPreview({ value }: { value: RichLinkPreview }) {
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
            className={styles.card}
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            dir="auto"
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
                <strong className={styles.title}>{title}</strong>
                {value.description && (
                    <span className={styles.description}>{value.description}</span>
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
