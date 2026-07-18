// Mirrors sanity-backend/schemas/objects/richContent.ts — the Portable Text
// shape now stored in every long-form description field (About, Education,
// Courses, Internships, Professional Experience, Projects). See
// components/RichContent for the renderer that consumes this shape.

export type RichSpan = {
    _type: 'span';
    _key: string;
    text: string;
    marks?: string[];
};

export type RichSpacer = {
    _type: 'spacer';
    _key: string;
    kind: 'gap' | 'newline';
};

export type RichMarkDef = {
    _type: 'link' | 'buttonLink';
    _key: string;
    href: string;
    icon?: 'link' | 'doc';
};

export type RichBlock = {
    _type: 'block';
    _key: string;
    style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    listItem?: 'bullet' | 'number';
    level?: number;
    markDefs?: RichMarkDef[];
    children: Array<RichSpan | RichSpacer>;
};

export type RichImage = {
    _type: 'image';
    _key: string;
    asset: { _ref: string; _type: 'reference' };
    alt: string;
    maxWidth?: number;
    maxHeight?: number;
};

export type RichImageRow = {
    _type: 'imageRow';
    _key: string;
    images: RichImage[];
    align?: 'left' | 'center' | 'right';
};

export type RichDivider = {
    _type: 'divider';
    _key: string;
};

export type RichCallout = {
    _type: 'callout';
    _key: string;
    style: 'highlight' | 'popup' | 'plain';
    color?: 'base' | 'secondary';
    body: RichContentNode[];
};

// Code block from @sanity/code-input.
export type RichCode = {
    _type: 'code';
    _key: string;
    code: string;
    language?: string;
    filename?: string;
    highlightedLines?: number[];
};

// Embedded YouTube video (block-level). Authors paste a URL + optional
// caption. The `video*`/`channel*`/`thumbnail` fields are filled at build
// time from the URL via YouTube's key-free oEmbed endpoint (see
// src/utils/youtube.ts, called from the hub detail +data loader) so the rich
// card renders from the static HTML with no API key or client fetch.
export type RichYouTube = {
    _type: 'youtube';
    _key: string;
    url: string;
    caption?: string;
    videoId?: string;
    videoTitle?: string;
    channelTitle?: string;
    channelUrl?: string;
    thumbnail?: string;
    featured?: boolean;
};

// A single podcast episode (block-level), the audio analogue of RichYouTube.
// The provider + inline embed are derived from `url` on the client (Spotify
// and YouTube links play inline; anything else links out), so no build-time
// enrichment is needed — all display metadata is authored by hand.
export type RichPodcastEpisode = {
    _type: 'podcastEpisode';
    _key: string;
    title: string;
    url: string;
    episodeLabel?: string;
    date?: string;
    duration?: string;
    note?: string;
    featured?: boolean;
};

// A single external article the author read and recommends. Rendered as a
// link-out row inside a Read-kind entry's body, which together form a curated
// reading list. Never plays inline — always links to the original.
export type RichReadingItem = {
    _type: 'readingItem';
    _key: string;
    title: string;
    url: string;
    source?: string;
    note?: string;
    featured?: boolean;
};

export type RichLinkPreview = {
    _type: 'linkPreview';
    _key: string;
    url: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    siteName?: string;
    faviconUrl?: string;
};

export type RichContentNode =
    | RichBlock
    | RichImageRow
    | RichDivider
    | RichCallout
    | RichCode
    | RichYouTube
    | RichPodcastEpisode
    | RichReadingItem
    | RichLinkPreview;
