import { useEffect } from 'react';
import { usePageContext } from 'vike-react/usePageContext';
import { usePreview } from '../contexts/PreviewContext';
import type { HubEntryKind } from '../Types';
import { applyClarityPage, bindClarityClicks, startClarity } from './clarity';

export default function ClarityRoot() {
    const pageContext = usePageContext();
    const { isPreview } = usePreview();
    const pathname = pageContext.urlPathname || '/';
    const hubKind = (pageContext.data as { entry?: { kind?: HubEntryKind } } | undefined)?.entry?.kind;

    useEffect(() => {
        void startClarity();
    }, []);

    useEffect(() => {
        if (!import.meta.env.PROD) return undefined;
        return bindClarityClicks();
    }, []);

    useEffect(() => {
        const search = typeof window === 'undefined' ? '' : window.location.search;
        applyClarityPage(pathname, search, { preview: isPreview, hubKind });
    }, [pathname, isPreview, hubKind]);

    return null;
}
