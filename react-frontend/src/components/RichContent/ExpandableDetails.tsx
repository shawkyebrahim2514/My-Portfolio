import { PortableText } from '@portabletext/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import type { RichExpandableDetails } from '../../Types';
import { components } from './components';
import styles from './ExpandableDetails.module.css';

export default function ExpandableDetails({ value }: { value: RichExpandableDetails }) {
    return (
        <details className={styles.details} open={value.openByDefault}>
            <summary className={styles.summary}>
                <span className={styles.toggle} aria-hidden="true">
                    <FontAwesomeIcon icon={faPlus} />
                </span>
                <span>{value.summary}</span>
            </summary>
            <div className={styles.body}>
                <PortableText value={value.body} components={components} />
            </div>
        </details>
    );
}
