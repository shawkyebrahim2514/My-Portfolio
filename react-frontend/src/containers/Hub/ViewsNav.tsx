import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faLayerGroup, faRss } from '@fortawesome/free-solid-svg-icons';
import { cx } from '../../utils/cx';
import styles from './CategoryFilters.module.css';

type HubView = 'entries' | 'follows' | 'library';

type HubViewsNavProps = {
    readonly activeView: HubView;
};

function HubViewsNav({ activeView }: HubViewsNavProps) {
    return (
        <nav className={styles.list} aria-label="Hub views">
            <a href="/hub" className={cx(styles.chip, activeView === 'entries' && styles.active)}>
                <span className={styles.icon}>
                    <FontAwesomeIcon icon={faLayerGroup} />
                </span>
                <span className={styles.label}>Posts</span>
            </a>
            <a href="/hub/follows" className={cx(styles.chip, activeView === 'follows' && styles.active)}>
                <span className={styles.icon}>
                    <FontAwesomeIcon icon={faRss} />
                </span>
                <span className={styles.label}>Follows</span>
            </a>
            <a href="/hub/library" className={cx(styles.chip, activeView === 'library' && styles.active)}>
                <span className={styles.icon}>
                    <FontAwesomeIcon icon={faBookmark} />
                </span>
                <span className={styles.label}>Library</span>
            </a>
        </nav>
    );
}

export default memo(HubViewsNav);
