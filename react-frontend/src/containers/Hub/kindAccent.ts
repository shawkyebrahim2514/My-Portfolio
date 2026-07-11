import type { CSSProperties } from 'react';
import { converter, formatHex, clampChroma, wcagContrast } from 'culori';
import type { HubEntryKind } from '../../Types';

// Per-kind DEFAULT accent colour — used when an entry doesn't define its own
// `accent` in Sanity. Each Hub kind keeps the site's warm palette but gets its
// own accent that flows through the kind badge, section headings, meta text,
// and hover states (via the `--entry-accent` custom property). This is the
// fallback base colour; a per-entry `accent` (see resolveThemeBase) overrides it.
export const KIND_ACCENT: Record<HubEntryKind, string> = {
    article: '#7c573f', // warm ink — editorial, text-first (matches --color-secondary-700)
    channel: '#e11d48', // broadcast red — creator/video
    podcast: '#6d5ae6', // modern violet — audio
    read: '#2563eb', // cool blue — curated collection
};

// The base colour that drives WHOLE-PAGE theming for a kind when no per-entry
// `accent` is set. `article` is intentionally null: articles are the native,
// text-first kind and keep the site's warm brand identity unchanged. The other
// kinds theme the entire page from their default accent.
const KIND_THEME_DEFAULT: Record<HubEntryKind, string | null> = {
    article: null,
    channel: KIND_ACCENT.channel,
    podcast: KIND_ACCENT.podcast,
    read: KIND_ACCENT.read,
};

// Resolve the base colour used for the local `--entry-accent` (kind badge,
// article accents). Always returns a colour — a per-entry `accent` wins,
// otherwise the kind default (article included).
function resolveAccentColor(kind: HubEntryKind, accent?: string): string {
    return accent ?? KIND_ACCENT[kind] ?? KIND_ACCENT.article;
}

// Resolve the base colour used to theme the WHOLE PAGE. A per-entry `accent`
// themes everything (articles included); otherwise fall back to the kind's
// theme default (null for articles → keep warm brand).
function resolveThemeBase(kind: HubEntryKind, accent?: string): string | null {
    if (accent) return accent;
    return KIND_THEME_DEFAULT[kind] ?? null;
}

// ---------------------------------------------------------------------------
// Palette generation
//
// A full 10-step secondary ramp is generated from ONE base colour. Rather than
// mixing toward white/black in sRGB (which muddies many hues), we anchor a
// fixed LIGHTNESS per step in OKLCH and inherit the base colour's HUE, scaling
// its CHROMA per step. Fixed lightness guarantees `-50` is always a usable
// light tint and `-700/-800` are always dark enough for text — for ANY base
// colour a user picks. This is the same approach modern systems (Radix,
// Tailwind v4) use to derive an accessible ramp from a single seed.
// ---------------------------------------------------------------------------
type Level = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type Ramp = Record<Level, string>;

const LEVELS: Level[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

// Target OKLCH lightness (0..1) per step. Cadence mirrors the warm brand ramp
// in tokens.css so a themed page keeps the site's light-to-dark rhythm.
const RAMP_L: Record<Level, number> = {
    50: 0.965,
    100: 0.930,
    200: 0.875,
    300: 0.800,
    400: 0.720,
    500: 0.640,
    600: 0.560,
    700: 0.475,
    800: 0.395,
    900: 0.320,
};

// Chroma as a fraction of the base colour's chroma. Light tints carry less
// saturation; the mid steps carry the most; deep shades ease off to avoid
// muddiness. Scaling relative to the base preserves how vivid/muted the picked
// colour is (a soft warm pick stays soft; a punchy pick stays punchy).
const RAMP_C: Record<Level, number> = {
    50: 0.25,
    100: 0.40,
    200: 0.60,
    300: 0.80,
    400: 0.95,
    500: 1.00,
    600: 0.97,
    700: 0.88,
    800: 0.78,
    900: 0.66,
};

const toOklch = converter('oklch');

// Cache generated ramps by base hex — themeStyle + kindAmbient both build from
// the same base within a render, and prerender renders many entries.
const rampCache = new Map<string, Ramp>();

function buildRamp(baseHex: string): Ramp {
    const cached = rampCache.get(baseHex);
    if (cached) return cached;

    const base = toOklch(baseHex);
    const hue = base?.h ?? 0; // achromatic picks (greys) have undefined hue → 0
    const baseChroma = base?.c ?? 0;

    const ramp = {} as Ramp;
    LEVELS.forEach((level) => {
        // Fixed lightness + inherited hue + scaled chroma, then pulled into the
        // sRGB gamut so the value is always renderable.
        const inGamut = clampChroma(
            { mode: 'oklch', l: RAMP_L[level], c: baseChroma * RAMP_C[level], h: hue },
            'oklch',
        );
        ramp[level] = formatHex(inGamut);
    });

    // Dev-only legibility guardrail: warn if body-text steps won't contrast on
    // the lightest tint. Never runs during the production prerender build.
    if (import.meta.env.DEV) {
        const onLight = wcagContrast(ramp[700], ramp[50]);
        if (onLight < 4.5) {
            console.warn(
                `[kindAccent] Generated accent from ${baseHex} has low contrast ` +
                `(-700 on -50 = ${onLight.toFixed(2)}, want >= 4.5). Consider a deeper base colour.`,
            );
        }
    }

    rampCache.set(baseHex, ramp);
    return ramp;
}

// Build the inline style exposing the local accent as `--entry-accent`.
// `CSSProperties` doesn't type custom properties, so cast at the boundary.
export function accentStyle(kind: HubEntryKind, accent?: string): CSSProperties {
    return { '--entry-accent': resolveAccentColor(kind, accent) } as CSSProperties;
}

// Build the page-level theme override: the full generated secondary ramp plus a
// hue wash over the neutral base ramp. Applied at the app shell
// (pages/+Layout.tsx) so the whole page — navbar and footer included — adopts
// the accent. Returns {} when the entry keeps the warm brand (article with no
// custom accent).
export function themeStyle(kind: HubEntryKind, accent?: string): CSSProperties {
    const base = resolveThemeBase(kind, accent);
    if (!base) return {};

    const ramp = buildRamp(base);
    const vars: Record<string, string> = { '--entry-accent': base };

    // 1) Recolour the accent ramp outright.
    LEVELS.forEach((level) => {
        vars[`--color-secondary-${level}`] = ramp[level];
    });

    // 2) Tint the NEUTRAL base ramp toward the accent. The base ramp paints the
    //    bulk of the page — backgrounds, cards, borders, body text, the dark
    //    navbar — so overriding only the accent leaves the page reading neutral.
    //    Mixing a small per-step amount of the accent into each base step gives
    //    every surface a subtle wash of the accent hue while keeping neutrals
    //    neutral enough to preserve legibility.
    (Object.keys(BASE_RAMP) as unknown as (keyof typeof BASE_RAMP)[]).forEach((level) => {
        const tint = BASE_TINT[level];
        vars[`--color-base-${level}`] =
            `color-mix(in srgb, ${BASE_RAMP[level]} ${100 - tint}%, ${base} ${tint}%)`;
    });

    return vars as CSSProperties;
}

// Ambient canvas effects (ClickSpark, ShapeGridBackground) resolve their colours
// from the DOM in JS at mount and can't read `color-mix()` custom properties, so
// the themed ramp can't reach them via CSS cascade. Expose the themed literal
// hexes for those effects: the spark uses the lighter `-400`, the hex-grid hover
// highlight uses `-300`. Returns null when the entry keeps the warm brand.
export function kindAmbient(kind: HubEntryKind, accent?: string): { spark: string; gridHover: string } | null {
    const base = resolveThemeBase(kind, accent);
    if (!base) return null;
    const ramp = buildRamp(base);
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
