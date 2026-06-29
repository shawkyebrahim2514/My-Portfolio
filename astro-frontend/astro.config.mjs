// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import rehypeNormalizeHeadings from './plugins/rehype-normalize-headings.mjs';

// https://astro.build/config
export default defineConfig({
  // Static site generation — Vercel auto-detects the Astro preset and
  // serves the prerendered `dist/` output. No serverless adapter needed
  // for this portfolio (keeps the dependency tree lean and vuln-free).
  output: 'static',
  site: 'https://www.shawkyebrahim.me',

  image: {
    // The hero avatar is the only remote image; everything else is bundled
    // from src/assets so Astro can optimize it at build time.
    domains: ['avatars.githubusercontent.com'],
  },

  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/design'),
    }),
  ],

  markdown: {
    // MDX inherits the markdown config; this normalizes content heading
    // levels for a sequential, accessible outline.
    rehypePlugins: [rehypeNormalizeHeadings],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
