import { PortableText } from '@portabletext/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleExclamation,
    faCircleInfo,
    faLightbulb,
    faStar,
} from '@fortawesome/free-solid-svg-icons';
import type { RichNote } from '../../Types';
import { cx } from '../../utils/cx';
import { components } from './components';
import styles from './Note.module.css';

const toneDetails = {
    note: { label: 'Note', icon: faCircleInfo },
    tip: { label: 'Tip', icon: faLightbulb },
    important: { label: 'Important', icon: faStar },
    warning: { label: 'Warning', icon: faCircleExclamation },
} as const;

export default function Note({ value }: { value: RichNote }) {
    const details = toneDetails[value.tone];
    return (
        <aside
            className={cx(
                styles.note,
                styles[`tone${value.tone[0].toUpperCase()}${value.tone.slice(1)}`]
            )}
        >
            <span className={styles.icon} aria-hidden="true">
                <FontAwesomeIcon icon={details.icon} />
            </span>
            <div className={styles.content}>
                <div className={styles.eyebrow}>{details.label}</div>
                {value.title && <h3 className={styles.title}>{value.title}</h3>}
                <div className={styles.body}>
                    <PortableText value={value.body} components={components} />
                </div>
            </div>
        </aside>
    );
}
