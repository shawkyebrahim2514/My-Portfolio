import type { Config } from 'vike/types';

// Per-entry title/description are set dynamically in +data.ts via
// useConfig() once the entry is fetched — these are just the fallback
// values used if that hook doesn't run (e.g. a 404).
export default {
  title: 'Hub — Shawky Ebrahim',
  description: 'Shared articles, videos, podcasts, reads, and books.',
} satisfies Config;
