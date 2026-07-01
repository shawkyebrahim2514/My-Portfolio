import { useEffect, useState } from 'react';

type QueryState<T> = {
    data: T | null;
    loading: boolean;
    error: Error | null;
};

/**
 * Fetches data from a Sanity query function with loading/error state.
 *
 * Replaces the repeated useState(null) + useEffect(fetch) pattern across
 * containers and, crucially, adds the error handling those copies lacked
 * (a rejected fetch previously left the loader spinning forever).
 *
 * Pass a stable `queryFn` reference (e.g. an imported API function).
 */
export function useSanityQuery<T>(queryFn: () => Promise<T>): QueryState<T> {
    const [state, setState] = useState<QueryState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let active = true;
        setState({ data: null, loading: true, error: null });

        queryFn()
            .then((data) => {
                if (active) {
                    setState({ data, loading: false, error: null });
                }
            })
            .catch((error: unknown) => {
                if (active) {
                    setState({
                        data: null,
                        loading: false,
                        error: error instanceof Error ? error : new Error(String(error)),
                    });
                }
            });

        return () => {
            active = false;
        };
    }, [queryFn]);

    return state;
}
