import { buildPageTags } from './pageTags';

export const CLARITY_PROJECT_ID = 'y8vvxvcwf4';
const VISITOR_KEY = 'clarity:visitor';

type ClarityClient = {
    init: (projectId: string) => void;
    setTag: (key: string, value: string | string[]) => void;
    identify: (customId: string, customSessionId?: string, customPageId?: string, friendlyName?: string) => void;
    consent: (consent?: boolean) => void;
    consentV2: (consentOptions?: { ad_Storage: 'granted' | 'denied'; analytics_Storage: 'granted' | 'denied' }) => void;
    upgrade: (reason: string) => void;
    event: (eventName: string) => void;
};

type PageTagOptions = { preview?: boolean; hubKind?: string };

let started = false;
let sdk: ClarityClient | null = null;
const pending: Array<(client: ClarityClient) => void> = [];

function withClarity(run: (client: ClarityClient) => void) {
    if (!import.meta.env.PROD) return;
    if (sdk) {
        try {
            run(sdk);
        } catch {
            /* Clarity is best-effort */
        }
        return;
    }
    pending.push(run);
}

function visitorId() {
    try {
        const existing = window.localStorage.getItem(VISITOR_KEY);
        if (existing) return existing;
        const created = crypto.randomUUID();
        window.localStorage.setItem(VISITOR_KEY, created);
        return created;
    } catch {
        return crypto.randomUUID();
    }
}

function flush(client: ClarityClient) {
    sdk = client;
    pending.splice(0).forEach((run) => {
        try {
            run(client);
        } catch {
            /* Clarity is best-effort */
        }
    });
}

export async function startClarity() {
    if (!import.meta.env.PROD || typeof window === 'undefined' || started) return;
    started = true;

    const { default: Clarity } = await import('@microsoft/clarity');
    Clarity.init(CLARITY_PROJECT_ID);
    Clarity.consentV2();
    Clarity.consent();
    Clarity.identify(visitorId(), undefined, window.location.pathname);
    flush(Clarity);
}

export function applyClarityPage(pathname: string, search = '', options?: PageTagOptions) {
    withClarity((client) => {
        client.identify(visitorId(), undefined, pathname);
        const tags = buildPageTags(pathname, search, options);
        (Object.entries(tags) as Array<[keyof typeof tags, string | undefined]>).forEach(([key, value]) => {
            if (value) client.setTag(key, value);
        });
    });
}

export function trackClarityEvent(name: string, upgrade?: string) {
    withClarity((client) => {
        client.event(name);
        if (upgrade) {
            client.setTag('converted', upgrade);
            client.upgrade(upgrade);
        }
    });
}

export function bindClarityClicks() {
    const onClick = (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const host = target.closest<HTMLElement>('[data-clarity-event], a[href]');
        if (!host) return;

        const named = host.dataset.clarityEvent;
        const upgrade = host.dataset.clarityUpgrade;
        if (named) {
            trackClarityEvent(named, upgrade);
            return;
        }
        if (host instanceof HTMLAnchorElement && host.origin !== window.location.origin) {
            trackClarityEvent('outbound');
        }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
}
