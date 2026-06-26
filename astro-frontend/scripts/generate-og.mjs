// Generate the social-share Open Graph image (1200x630) from a local HTML
// template, using the already-installed Playwright + Edge. Run once and commit
// the resulting PNG; re-run whenever the branding changes.
//
// Usage:
//   node scripts/generate-og.mjs
//
// Writes public/og.png.

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const templatePath = resolve(here, 'og-template.html');
const outPath = resolve(here, '..', 'public', 'og.png');

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto('file://' + templatePath, { waitUntil: 'networkidle' });
// Give the remote avatar a beat to decode.
await page.waitForTimeout(500);
await page.screenshot({
  path: outPath,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});
await browser.close();
console.log('wrote', outPath);
