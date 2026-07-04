// Per-page <head> override — proves distinct SEO metadata per route
// (currently ALL routes share one static block in index.html).
import type { Config } from 'vike/types';

export default {
  title: 'Skills — Shawky Ebrahim',
  description:
    'Technical skills of Shawky Ebrahim — Software Engineer at Microsoft: languages, frameworks, and tools.',
} satisfies Config;
