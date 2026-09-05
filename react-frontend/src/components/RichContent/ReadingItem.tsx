import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faBookmark } from '@fortawesome/free-solid-svg-icons';
import Text from '../Text';
import { cx } from '../../utils/cx';
import type { RichReadingItem } from '../../Types';
import { urlForImage } from './utils';
import styles from './ReadingItem.module.css';

// One recommended article inside a Read-kind entry's body. A compact link-out
// row: title (the link), source, and an optional note. No inline embed — the
// whole card opens the original in a new tab. In the `featured` variant it
// renders larger and without the running list index (used for the pinned
// "lead pick" above the numbered list).
function ReadingItem({
    value,
    variant = 'row',
}: {
    value: RichReadingItem;
    variant?: 'row' | 'featured';
}) {
    let host: string | undefined;
    try {
        host = new URL(value.url).hostname.replace(/^www\./, '');
    } catch {
        host = undefined;
    }
    const source = value.source ?? host;
    const favicon = value.favicon?.asset?._ref
        ? urlForImage(value.favicon.asset)
        : host
          ? `https://www.google.com/s2/favicons?domain=${host}&sz=64`
          : undefined;
    const isFeatured = variant === 'featured';
    const details = [value.contentType, value.author, value.publishedAt]
        .filter((detail): detail is string => Boolean(detail))
        .join(' · ');

    return (
        <a
            className={cx(styles.card, isFeatured && styles.featured)}
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            dir="auto"
        >
            {!isFeatured && <span className={styles.num} aria-hidden="true" />}
            <span className={styles.favicon} aria-hidden="true">
                {favicon ? (
                    <img src={favicon} alt="" width={24} height={24} loading="lazy" />
                ) : (
                    <FontAwesomeIcon icon={faBookmark} />
                )}
            </span>
            <div className={styles.body}>
                <Text variant={isFeatured ? 'h3' : 'h4'} className={styles.title}>
                    {value.title}
                </Text>
                {value.note && <p className={styles.note}>{value.note}</p>}
                {(source || details) && (
                    <div className={styles.meta}>
                        {source && <span className={styles.source}>{source}</span>}
                        {details && <span className={styles.details}>{details}</span>}
                    </div>
                )}
            </div>
            <span className={styles.icon} aria-hidden="true">
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </span>
        </a>
    );
}

export default memo(ReadingItem);
