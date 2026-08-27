import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { cx } from '../../utils/cx';
import InlineSvg from '../../components/InlineSvg';
import type { SanityHubCategory } from '../../Types';
import styles from './CategoryFilters.module.css';

type CategoryRef = { slug: string } | null;

export function countByCategorySlug(
    items: readonly { categories: readonly CategoryRef[] }[],
): Map<string, number> {
    const counts = new Map<string, number>();
    items.forEach((item) => {
        const slugs = new Set(
            item.categories
                .filter((category): category is { slug: string } => Boolean(category))
                .map((category) => category.slug),
        );
        slugs.forEach((slug) => {
            counts.set(slug, (counts.get(slug) ?? 0) + 1);
        });
    });
    return counts;
}

type CategoryFiltersProps = {
    readonly categories: Pick<SanityHubCategory, 'title' | 'slug' | 'icon'>[];
    readonly activeSlug?: string;
    readonly allCount?: number;
    readonly counts?: Map<string, number>;
    readonly query?: string;
};

function CategoryFilters({ categories, activeSlug, allCount, counts, query = '' }: CategoryFiltersProps) {
    if (categories.length === 0) return null;

    return (
        <nav className={styles.list} aria-label="Filter by category">
            <a
                href={`/hub${query}`}
                className={cx(styles.chip, !activeSlug && styles.active)}
                data-clarity-event="hubFilter"
            >
                <span className={styles.icon}>
                    <FontAwesomeIcon icon={faLayerGroup} />
                </span>
                <span className={styles.label}>All</span>
                {allCount != null && <span className={styles.count}>{allCount}</span>}
            </a>
            {categories.map((category) => {
                const inlineSvg = category.icon?.metadata?.inlineSvg;
                const count = counts?.get(category.slug);
                return (
                    <a
                        key={category.slug}
                        href={`/hub/category/${category.slug}${query}`}
                        className={cx(styles.chip, activeSlug === category.slug && styles.active)}
                        data-clarity-event="hubFilter"
                    >
                        {inlineSvg ? <InlineSvg className={styles.icon} svg={inlineSvg} /> : null}
                        <span className={styles.label}>{category.title}</span>
                        {count != null && <span className={styles.count}>{count}</span>}
                    </a>
                );
            })}
        </nav>
    );
}

export default memo(CategoryFilters);
