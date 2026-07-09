import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import Text from '../Text';
import type { RichReadingItem } from '../../Types';
import styles from './ReadingItem.module.css';

// One recommended article inside a Read-kind entry's body. A compact link-out
// row: title (the link), source, and an optional note. No inline embed — the
// whole card opens the original in a new tab.
function ReadingItem({ value }: { value: RichReadingItem }) {
    let host: string | undefined;
    try {
        host = new URL(value.url).hostname.replace(/^www\./, '');
    } catch {
        host = undefined;
    }
    const source = value.source ?? host;

    return (
        <a
            className={styles.card}
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            dir="auto"
        >
            <div className={styles.body}>
                <Text variant="h4" className={styles.title}>
                    {value.title}
                </Text>
                {source && <span className={styles.source}>{source}</span>}
                {value.note && <p className={styles.note}>{value.note}</p>}
            </div>
            <span className={styles.icon} aria-hidden="true">
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </span>
        </a>
    );
}

export default memo(ReadingItem);
