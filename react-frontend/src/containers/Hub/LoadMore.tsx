import { useEffect, useState } from 'react';
import styles from './LoadMore.module.css';

export const LOAD_MORE_PAGE_SIZE = 12;

export function useLoadMore(resetKey: string, pageSize = LOAD_MORE_PAGE_SIZE) {
    const [visibleCount, setVisibleCount] = useState(pageSize);

    useEffect(() => {
        setVisibleCount(pageSize);
    }, [resetKey, pageSize]);

    return {
        visibleCount,
        loadMore: () => setVisibleCount((count) => count + pageSize),
    };
}

type LoadMoreProps = {
    readonly shown: number;
    readonly total: number;
    readonly pageSize?: number;
    readonly onLoadMore: () => void;
};

function LoadMore({
    shown,
    total,
    pageSize = LOAD_MORE_PAGE_SIZE,
    onLoadMore,
}: LoadMoreProps) {
    if (total === 0) return null;

    const remaining = Math.max(0, total - shown);
    const nextPageSize = Math.min(pageSize, remaining);

    return (
        <div className={styles.pagination} aria-live="polite">
            <p className={styles.pageStatus}>
                Showing {shown} of {total}
            </p>
            {remaining > 0 && (
                <button
                    type="button"
                    className={styles.loadMore}
                    onClick={onLoadMore}
                    data-clarity-event="hubLoadMore"
                >
                    Load {nextPageSize} more
                </button>
            )}
        </div>
    );
}

export default LoadMore;
