import type { SanityHubEntry } from '../Types';
import {
    DEFAULT_DESCRIPTION,
    DEFAULT_OG_IMAGE,
    PERSON_ID,
    PERSON_IMAGE,
    SAME_AS,
    SITE_NAME,
    SITE_TITLE,
    SITE_URL,
    WEBSITE_ID,
    absoluteUrl,
    canonicalUrl,
} from './site';

export function personJsonLd() {
    return {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        image: PERSON_IMAGE,
        jobTitle: 'Software Engineer',
        worksFor: { '@type': 'Organization', name: 'Microsoft' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Cairo University' },
        description: DEFAULT_DESCRIPTION,
        knowsAbout: [
            'Software Engineering',
            'Frontend Engineering',
            'React',
            'TypeScript',
            'Web Development',
        ],
        sameAs: [...SAME_AS],
    };
}

export function websiteJsonLd() {
    return {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: DEFAULT_DESCRIPTION,
        inLanguage: ['en', 'ar'],
        publisher: { '@id': PERSON_ID },
    };
}

export function profilePageJsonLd() {
    return {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/`,
        url: `${SITE_URL}/`,
        name: SITE_TITLE,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID },
    };
}

export function hubEntryJsonLd(entry: Pick<SanityHubEntry, 'title' | 'excerpt' | 'slug' | 'kind' | 'language' | 'coverImage' | 'channel' | 'publishedAt' | 'tags'>, pathname: string) {
    const url = canonicalUrl(pathname);
    const image = absoluteUrl(entry.coverImage || entry.channel?.avatar) || DEFAULT_OG_IMAGE;
    const type = entry.kind === 'article' ? 'BlogPosting' : 'CreativeWork';

    return {
        '@type': type,
        '@id': `${url}#work`,
        headline: entry.title,
        name: entry.title,
        description: entry.excerpt,
        url,
        image,
        datePublished: entry.publishedAt,
        inLanguage: entry.language === 'ar' ? 'ar' : 'en',
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
        isPartOf: { '@id': WEBSITE_ID },
        ...(entry.tags?.length ? { keywords: entry.tags.join(', ') } : {}),
    };
}

export function siteJsonLdGraph(pathname: string, entry?: Parameters<typeof hubEntryJsonLd>[0]) {
    const graph: object[] = [personJsonLd(), websiteJsonLd()];
    const path = pathname.replace(/\/+$/, '') || '/';
    if (path === '/') graph.push(profilePageJsonLd());
    if (entry) graph.push(hubEntryJsonLd(entry, pathname));
    return {
        '@context': 'https://schema.org',
        '@graph': graph,
    };
}
