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
    listItem?: 'bullet';
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

export type RichContentNode = RichBlock | RichImageRow | RichDivider | RichCallout;
