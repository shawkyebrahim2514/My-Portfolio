import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import type { RichQuote } from '../../Types';
import styles from './Quote.module.css';

export default function Quote({ value }: { value: RichQuote }) {
    const attribution = [value.author, value.source].filter(Boolean).join(' - ');
    return (
        <figure className={styles.quote}>
            <FontAwesomeIcon className={styles.mark} icon={faQuoteLeft} aria-hidden="true" />
            <blockquote className={styles.text}>{value.text}</blockquote>
            {(attribution || value.sourceUrl) && (
                <figcaption className={styles.citation}>
                    {value.sourceUrl ? (
                        <a href={value.sourceUrl} target="_blank" rel="noopener noreferrer">
                            {attribution || 'View source'}{' '}
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </a>
                    ) : (
                        attribution
                    )}
                </figcaption>
            )}
        </figure>
    );
}
