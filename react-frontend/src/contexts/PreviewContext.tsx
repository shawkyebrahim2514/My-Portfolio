import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

// Client-side "preview mode" gate for hidden Hub entries.
//
// The site is a static prerender (no server), so entries flagged
// `hiddenInProduction` are still shipped to production — they're just filtered
// out of every listing on the client. Preview mode reveals them:
//   - Local development (import.meta.env.DEV) is ALWAYS in preview mode.
//   - On the live site, visiting any URL with ?preview=1 turns it on and
//     persists it (localStorage); ?preview=0 turns it back off.
//
// This is an unlisted gate, not a security boundary: the hidden data is present
// in the bundle. Hidden entry pages are additionally marked noindex.

const STORAGE_KEY = 'hub:preview';

type PreviewContextValue = {
    isPreview: boolean;
    // True only when preview was explicitly enabled on the live site (not the
    // always-on local-dev case) — used to decide whether to show the banner.
    isExplicit: boolean;
    exitPreview: () => void;
};

const Context = createContext<PreviewContextValue>({
    isPreview: false,
    isExplicit: false,
    exitPreview: () => {},
});

export const usePreview = () => useContext(Context);
export const useIsPreview = () => useContext(Context).isPreview;

type PreviewProviderProps = {
    readonly children: ReactNode;
};

export default function PreviewProvider({ children }: PreviewProviderProps) {
    // Initial value must be identical on the server (prerender) and the first
    // client render to avoid a hydration mismatch. import.meta.env.DEV is a
    // build-time constant, so it satisfies that. The real (localStorage/URL)
    // value is resolved in the effect below, after hydration.
    const [isPreview, setIsPreview] = useState<boolean>(import.meta.env.DEV);
    const [isExplicit, setIsExplicit] = useState<boolean>(false);

    useEffect(() => {
        if (import.meta.env.DEV) {
            setIsPreview(true);
            return;
        }
        let enabled: boolean;
        try {
            const param = new URLSearchParams(window.location.search).get('preview');
            if (param === '1') {
                localStorage.setItem(STORAGE_KEY, '1');
                enabled = true;
            } else if (param === '0') {
                localStorage.removeItem(STORAGE_KEY);
                enabled = false;
            } else {
                enabled = localStorage.getItem(STORAGE_KEY) === '1';
            }
        } catch {
            enabled = false;
        }
        setIsPreview(enabled);
        setIsExplicit(enabled);
    }, []);

    const exitPreview = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
        // Drop any ?preview param from the URL and reload so the prerendered
        // (production-default) view is restored cleanly.
        const url = new URL(window.location.href);
        url.searchParams.delete('preview');
        window.location.replace(url.toString());
    }, []);

    const value = useMemo(
        () => ({ isPreview, isExplicit, exitPreview }),
        [isPreview, isExplicit, exitPreview],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
}
