import { RichContentNode } from './richContent';

// Mirrors sanity-backend/schemas/hub/hubEntry.ts `kind` options.
export type HubEntryKind = 'article' | 'video' | 'podcast' | 'read' | 'book';

export type HubEntryCategoryRef = {
    title: string;
    slug: string;
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
    coverImage?: string;
    sourceThumbnail?: string;
    sourceName?: string;
    durationLabel?: string;
    externalUrl?: string;
    publishedAt: string;
    featured: boolean;
    // Items can be `null` if a referenced hubCategory is deleted or
    // temporarily unresolvable — callers must filter before rendering.
    categories: (HubEntryCategoryRef | null)[];
};

// Full entry, as fetched for the /hub/[slug] detail page.
export type SanityHubEntry = SanityHubEntrySummary & {
    tags?: string[];
    body: RichContentNode[];
};
