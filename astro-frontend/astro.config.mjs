// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Static site generation — Vercel auto-detects the Astro preset and
  // serves the prerendered `dist/` output. No serverless adapter needed
  // for this portfolio (keeps the dependency tree lean and vuln-free).
  output: 'static',
  site: 'https://www.shawkyebrahim.me',

  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/design'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
