import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import type { HubEntryCategoryRef } from '../../Types';
import styles from './HubBreadcrumb.module.css';

type HubBreadcrumbProps = {
    readonly category?: HubEntryCategoryRef;
};

function HubBreadcrumb({ category }: HubBreadcrumbProps) {
    return (
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="/hub" className={styles.crumb}>
                <FontAwesomeIcon icon={faArrowLeftLong} />
                Hub
            </a>
            {category && (
                <>
                    <span className={styles.crumbSep} aria-hidden="true">
                        /
                    </span>
                    <a href={`/hub/category/${category.slug}`} className={styles.crumb}>
                        {category.title}
                    </a>
                </>
            )}
        </nav>
    );
}

export default memo(HubBreadcrumb);
