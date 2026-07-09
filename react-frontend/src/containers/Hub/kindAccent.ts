import type { CSSProperties } from 'react';
import type { HubEntryKind } from '../../Types';

// Per-kind accent colour — the unifying differentiation lever. Each Hub kind
// keeps the site's warm palette but gets its own accent that flows through the
// kind badge, section headings, meta text, and hover states (via the
// `--entry-accent` custom property set on the entry/card root). This is what
// makes a page instantly "read" as its kind at a glance.
export const KIND_ACCENT: Record<HubEntryKind, string> = {
    article: '#7c573f', // warm ink — editorial, text-first (matches --color-secondary-700)
    channel: '#e11d48', // broadcast red — creator/video
    podcast: '#6d5ae6', // modern violet — audio
    read: '#2563eb', // cool blue — curated collection
};

// Build the inline style that exposes the accent to CSS as `--entry-accent`.
// `CSSProperties` doesn't type custom properties, so cast at the boundary.
export function accentStyle(kind: HubEntryKind): CSSProperties {
    return { '--entry-accent': KIND_ACCENT[kind] ?? KIND_ACCENT.article } as CSSProperties;
}
