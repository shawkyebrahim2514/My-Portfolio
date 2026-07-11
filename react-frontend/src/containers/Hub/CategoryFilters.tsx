import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { cx } from '../../utils/cx';
import InlineSvg from '../../components/InlineSvg';
import type { SanityHubCategory } from '../../Types';
import styles from './CategoryFilters.module.css';

type CategoryFiltersProps = {
    readonly categories: Pick<SanityHubCategory, 'title' | 'slug' | 'icon'>[];
    readonly activeSlug?: string;
};

function CategoryFilters({ categories, activeSlug }: CategoryFiltersProps) {
    if (categories.length === 0) return null;

    return (
        <nav className={styles.list} aria-label="Filter by category">
            <a href="/hub" className={cx(styles.chip, !activeSlug && styles.active)}>
                <span className={styles.icon}>
                    <FontAwesomeIcon icon={faLayerGroup} />
                </span>
                <span className={styles.label}>All</span>
            </a>
            {categories.map((category) => {
                const inlineSvg = category.icon?.metadata?.inlineSvg;
                return (
                    <a
                        key={category.slug}
                        href={`/hub/category/${category.slug}`}
                        className={cx(styles.chip, activeSlug === category.slug && styles.active)}
                    >
                        {inlineSvg ? <InlineSvg className={styles.icon} svg={inlineSvg} /> : null}
                        <span className={styles.label}>{category.title}</span>
                    </a>
                );
            })}
        </nav>
    );
}

export default memo(CategoryFilters);
