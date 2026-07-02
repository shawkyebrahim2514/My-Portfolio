import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from './Loader.module.css';

export default function Loader() {
    return (
        <div className={styles.loader} role="status" aria-live="polite">
            <FontAwesomeIcon className={styles.spinner} icon={faSpinner} size="2x" spin />
            <span className="sr-only">Loading…</span>
        </div>
    )
}