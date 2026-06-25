// Visual smoke-check: drive the local dev server in Edge and capture full-page
// screenshots of every route. Useful for eyeballing rendering after content or
// design changes.
//
// Usage (with the dev server running on 127.0.0.1:4321):
//   node scripts/screenshots.mjs [outputDir]
//
// Defaults to writing PNGs into ./screenshots.

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const outDir = process.argv[2] ?? 'screenshots';
const base = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4321';
const routes = [
  ['home', '/'],
  ['skills', '/skills'],
  ['education', '/education'],
  ['experience', '/experience'],
  ['projects', '/projects'],
  ['contacts', '/contacts'],
];

mkdirSync(outDir, { recursive: true });

// Optional: set THEME=dark to preview the dark palette.
const theme = process.env.THEME;

const browser = await chromium.launch({ channel: 'msedge' });
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
if (theme) {
  await ctx.addInitScript((t) => {
    try {
      localStorage.setItem('theme', t);
    } catch {
      /* ignore */
    }
  }, theme);
}
const page = await ctx.newPage();

for (const [name, route] of routes) {
  await page.goto(base + route, { waitUntil: 'networkidle' });
  // Scroll through to trigger client:visible hydration + reveal animations.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 200));
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true });
  console.log(`captured ${name}`);
}

await browser.close();
console.log('done');
