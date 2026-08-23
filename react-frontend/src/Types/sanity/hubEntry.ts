import { RichContentNode, RichYouTube } from './richContent';

// Mirrors sanity-backend/schemas/hub/hubEntry.ts `kind` options.
export type HubEntryKind = 'article' | 'channel' | 'podcast' | 'read';

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

export type HubChannelPlatform =
    | 'youtube'
    | 'github'
    | 'linkedin'
    | 'facebook'
    | 'podcast'
    | 'website'
    | 'twitter';

export type HubChannelDetails = {
    platform: HubChannelPlatform;
    url: string;
    name: string;
    channelId?: string;
    handle?: string;
    avatar?: string;
    moreVideos?: RichYouTube[];
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
    channel?: HubChannelDetails;
    durationLabel?: string;
    publishedAt: string;
    featured: boolean;
    featuredInCategory?: boolean;
    // Optional per-entry base accent colour (hex, e.g. "#6d5ae6). When set, the
    // whole entry page is themed from this one colour (a full ramp is generated
    // from it); otherwise the entry's kind default is used. Mirrors the Sanity
    // `accent` colour field, projected as `accent.hex`.
    accentColor?: string;
    // When true, the entry is hidden from every production listing (Hub index,
    // categories, About teaser, recommendations). Still shown in local dev and
    // when preview mode is on (?preview=1). Mirrors the Sanity
    // `hiddenInProduction` boolean; absent/false means publicly visible.
    hiddenInProduction?: boolean;
    // Items can be `null` if a referenced hubCategory is deleted or
    // temporarily unresolvable — callers must filter before rendering.
    categories: (HubEntryCategoryRef | null)[];
};

// Full entry, as fetched for the /hub/[slug] detail page.
export type SanityHubEntry = SanityHubEntrySummary & {
    tags?: string[];
    // "Listen On" platform links shown as brand pills in the Podcast hero.
    platforms?: HubPlatformLink[];
    body?: RichContentNode[];
};
