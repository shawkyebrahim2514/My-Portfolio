// Automated accessibility check: runs axe-core against every route in the
// running dev server using the already-installed Playwright + Edge. axe-core
// is loaded from a CDN at runtime, so this adds no project dependency.
//
// Usage (with the dev server running on 127.0.0.1:4321):
//   node scripts/a11y-check.mjs
//
// Exits non-zero if any route has violations.

import { chromium } from 'playwright';

const base = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4321';
const routes = [
  '/',
  '/skills',
  '/education',
  '/experience',
  '/projects',
  '/contacts',
];
const AXE_CDN =
  'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';

const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage();

let total = 0;
for (const route of routes) {
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.addScriptTag({ url: AXE_CDN });
  const results = await page.evaluate(async () => {
    // eslint-disable-next-line no-undef
    return await axe.run(document, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
    });
  });
  const v = results.violations;
  total += v.length;
  if (v.length === 0) {
    console.log(`✓ ${route} — no violations`);
  } else {
    console.log(`✗ ${route} — ${v.length} violation(s):`);
    for (const item of v) {
      console.log(`   [${item.impact}] ${item.id}: ${item.help}`);
      for (const node of item.nodes) {
        console.log(`      → ${node.target.join(' ')}`);
      }
    }
  }
}

await browser.close();
console.log(
  total === 0
    ? '\nAll routes pass axe-core.'
    : `\n${total} total violation(s).`,
);
process.exit(total === 0 ? 0 : 1);
