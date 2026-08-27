export const SITE_URL = 'https://shawkyebrahim.vercel.app';
export const SITE_NAME = 'Shawky Ebrahim';
export const SITE_TITLE = 'Shawky Ebrahim — Software Engineer';
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const PERSON_IMAGE = 'https://github.com/shawkyebrahim2514.png';

export const DEFAULT_DESCRIPTION =
    'Portfolio of Shawky Ebrahim — Software Engineer at Microsoft. Skills, education, experience, projects, and a Hub of articles, channels, and reading I share.';

export const SAME_AS = [
    'https://github.com/shawkyebrahim2514',
    'https://www.linkedin.com/in/shawkyebrahim2514/',
    'https://www.facebook.com/shawkyebrahim2514/',
    'https://www.behance.net/shawkyebrahim2514',
    'https://t.me/shawkyebrahim2514',
    'https://wuzzuf.net/me/shawkyebrahim2514',
] as const;

export const STATIC_PATHS = [
    '/',
    '/skills',
    '/education',
    '/experience',
    '/projects',
    '/contacts',
    '/hub',
    '/hub/follows',
] as const;

/** Absolute canonical URL. Root keeps a trailing slash; every other path does not. */
export function canonicalUrl(pathname: string, siteUrl = SITE_URL): string {
    const path = pathname.replace(/\/+$/, '') || '/';
    return path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`;
}

export function absoluteUrl(url: string | undefined, siteUrl = SITE_URL): string | undefined {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    return `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export function isHubEntryPath(pathname: string): boolean {
    const path = pathname.replace(/\/+$/, '') || '/';
    return path.startsWith('/hub/') && path !== '/hub/follows' && !path.startsWith('/hub/category/');
}
