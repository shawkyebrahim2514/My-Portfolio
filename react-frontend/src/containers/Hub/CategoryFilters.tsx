import { memo } from 'react';
import { cx } from '../../utils/cx';
import buttonStyles from '../../components/Button/Button.module.css';
import type { SanityHubCategory } from '../../Types';
import styles from './CategoryFilters.module.css';

type CategoryFiltersProps = {
    readonly categories: Pick<SanityHubCategory, 'title' | 'slug'>[];
    readonly activeSlug?: string;
};

function CategoryFilters({ categories, activeSlug }: CategoryFiltersProps) {
    if (categories.length === 0) return null;

    return (
        <nav className={styles.list} aria-label="Filter by category">
            <a
                href="/hub"
                className={cx(buttonStyles.button, buttonStyles.sm, buttonStyles.pointer, !activeSlug && styles.active)}
            >
                All
            </a>
            {categories.map((category) => (
                <a
                    key={category.slug}
                    href={`/hub/category/${category.slug}`}
                    className={cx(
                        buttonStyles.button,
                        buttonStyles.sm,
                        buttonStyles.pointer,
                        activeSlug === category.slug && styles.active
                    )}
                >
                    {category.title}
                </a>
            ))}
        </nav>
    );
}

export default memo(CategoryFilters);
