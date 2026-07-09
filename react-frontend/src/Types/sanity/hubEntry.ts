import { RichContentNode } from './richContent';

// Mirrors sanity-backend/schemas/hub/hubEntry.ts `kind` options.
export type HubEntryKind = 'article' | 'channel' | 'podcast' | 'read' | 'book';

// Mirrors the `language` field — drives text direction (LTR/RTL) and the
// font applied when rendering an entry's title/excerpt/body.
export type HubContentLanguage = 'en' | 'ar';

export type HubEntryCategoryRef = {
    title: string;
    slug: string;
};

// A "Listen On" platform link shown as a brand pill in the Podcast header.
export type HubPlatformLink = {
    platform: 'spotify' | 'apple' | 'youtube' | 'soundcloud' | 'anghami' | 'rss' | 'website';
    url: string;
};

// Fields needed to render a card/list item — used by the /hub index,
// /hub/category/[slug] listing, and the About-page "See what I share"
// teaser. Deliberately excludes `body`/`tags` (only needed on the detail
// page) to keep list queries light.
export type SanityHubEntrySummary = {
    title: string;
    slug: string;
    kind: HubEntryKind;
    excerpt: string;
    // Defaults to 'en' when absent (legacy entries seeded before the field
    // existed). Controls RTL rendering + Arabic font on cards and detail page.
    language?: HubContentLanguage;
    coverImage?: string;
    sourceThumbnail?: string;
    sourceName?: string;
    durationLabel?: string;
    externalUrl?: string;
    publishedAt: string;
    featured: boolean;
    featuredInCategory?: boolean;
    // Items can be `null` if a referenced hubCategory is deleted or
    // temporarily unresolvable — callers must filter before rendering.
    categories: (HubEntryCategoryRef | null)[];
};

// Full entry, as fetched for the /hub/[slug] detail page.
export type SanityHubEntry = SanityHubEntrySummary & {
    tags?: string[];
    // Optional @handle shown in the Channel-kind hero, e.g. "@fireship".
    channelHandle?: string;
    // "Listen On" platform links shown as brand pills in the Podcast hero.
    platforms?: HubPlatformLink[];
    body: RichContentNode[];
};
