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

// Full per-kind secondary (accent) ramp. When an entry page adopts its kind's
// theme, we don't just recolour Hub-specific elements — we override the whole
// `--color-secondary-*` ramp for that page so EVERYTHING that reads the brand
// accent (navbar, buttons, category chips, breadcrumb, callouts, highlights,
// recommendations…) turns the kind's hue, making the page feel of a piece.
//
// Each ramp is anchored so `-500` is the kind's base accent (KIND_ACCENT),
// with lighter tints (50–400) and darker shades (600–900) around it, matching
// the lightness cadence of the warm brand ramp in tokens.css. `-700` stays
// dark enough for body/label text contrast on the light base backgrounds.
//
// `article` is intentionally null: articles are the native, text-first kind and
// keep the site's warm brand identity unchanged.
type SecondaryRamp = Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>;

const KIND_SECONDARY_RAMP: Record<HubEntryKind, SecondaryRamp | null> = {
    article: null,
    // Broadcast red (rose family), base #e11d48 at -500.
    channel: {
        50: '#fff1f2',
        100: '#ffe4e6',
        200: '#fecdd3',
        300: '#fda4af',
        400: '#f43f5e',
        500: '#e11d48',
        600: '#be123c',
        700: '#9f1239',
        800: '#881337',
        900: '#6b0f2e',
    },
    // Modern violet, base #6d5ae6 at -500.
    podcast: {
        50: '#f2f0fd',
        100: '#e7e3fb',
        200: '#d0c9f7',
        300: '#b3a7f1',
        400: '#9080ec',
        500: '#6d5ae6',
        600: '#5741cf',
        700: '#4835ab',
        800: '#3a2b86',
        900: '#2c2065',
    },
    // Cool blue, base #2563eb at -500.
    read: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#3b82f6',
        500: '#2563eb',
        600: '#1d4ed8',
        700: '#1e40af',
        800: '#1e3a8a',
        900: '#172554',
    },
};

// Build the page-level theme override for a kind: the full secondary ramp plus
// `--entry-accent`. Applied at the app shell (pages/+Layout.tsx) on an entry
// page so the whole page — navbar and footer included — adopts the kind hue.
// Returns an empty object for kinds that keep the warm brand (article/unknown).
export function themeStyle(kind: HubEntryKind): CSSProperties {
    const ramp = KIND_SECONDARY_RAMP[kind];
    if (!ramp) return {};
    const accent = KIND_ACCENT[kind];
    const vars: Record<string, string> = { '--entry-accent': accent };

    // 1) Recolour the accent ramp outright.
    (Object.keys(ramp) as unknown as (keyof SecondaryRamp)[]).forEach((level) => {
        vars[`--color-secondary-${level}`] = ramp[level];
    });

    // 2) Tint the NEUTRAL base ramp toward the accent. The base ramp is what
    //    paints the bulk of the page — backgrounds, cards, borders, body text,
    //    the dark navbar — so overriding only the accent leaves the page reading
    //    neutral. Mixing a small, per-step amount of the accent into each base
    //    step gives every surface a subtle wash of the kind's hue (homogeneous
    //    page) while keeping neutrals neutral enough to preserve legibility.
    (Object.keys(BASE_RAMP) as unknown as (keyof typeof BASE_RAMP)[]).forEach((level) => {
        const tint = BASE_TINT[level];
        vars[`--color-base-${level}`] =
            `color-mix(in srgb, ${BASE_RAMP[level]} ${100 - tint}%, ${accent} ${tint}%)`;
    });

    return vars as CSSProperties;
}

// Ambient canvas effects (ClickSpark, ShapeGridBackground) resolve their colours
// from the DOM in JS at mount and can't read `color-mix()` custom properties, so
// the themed ramp can't reach them via CSS cascade. Expose the themed literal
// hexes for those effects: the spark uses the lighter `-400`, the hex-grid hover
// highlight uses `-300`. Returns null for kinds that keep the warm brand.
export function kindAmbient(kind: HubEntryKind): { spark: string; gridHover: string } | null {
    const ramp = KIND_SECONDARY_RAMP[kind];
    if (!ramp) return null;
    return { spark: ramp[400], gridHover: ramp[300] };
}
const BASE_RAMP = {
    0: '#ffffff',
    50: '#fafaf6',
    100: '#edeee6',
    200: '#d4d5cd',
    300: '#bdbdb6',
    400: '#a5a59f',
    500: '#898984',
    600: '#6f706c',
    700: '#545451',
    800: '#393937',
    900: '#282827',
} as const;

// Per-step accent percentage mixed into the base ramp. Light surfaces get a
// gentle wash; mid-tones and the dark navbar (900) take a touch more so the
// theme reads clearly across the whole page, while body-text steps (700/800)
// stay restrained to protect contrast.
const BASE_TINT: Record<keyof typeof BASE_RAMP, number> = {
    0: 5,
    50: 7,
    100: 9,
    200: 11,
    300: 13,
    400: 14,
    500: 14,
    600: 13,
    700: 11,
    800: 12,
    900: 16,
};
