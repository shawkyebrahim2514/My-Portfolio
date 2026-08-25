import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import type { RichKeyTakeaways } from '../../Types';
import styles from './KeyTakeaways.module.css';

export default function KeyTakeaways({ value }: { value: RichKeyTakeaways }) {
    return (
        <section className={styles.takeaways} aria-label={value.title}>
            <h2 className={styles.title}>{value.title}</h2>
            <ul className={styles.list}>
                {value.items.map((item, index) => (
                    <li key={`${index}-${item}`} className={styles.item}>
                        <span className={styles.check} aria-hidden="true">
                            <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
