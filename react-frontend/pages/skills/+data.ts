// Spike-only +data hook: runs server-side (and at build-time when the page
// is pre-rendered), fetching directly from Sanity — the same query the
// existing client-side `useSanityQuery(getSkillsPage)` call uses in
// src/containers/Skills/index.tsx, just moved off the client so the HTML
// already contains real content when it reaches the browser/crawler.
import { getSkillsPage } from '../../src/APIs';
import type { SanitySkillsPage } from '../../src/Types';

export async function data(): Promise<SanitySkillsPage> {
  return getSkillsPage();
}
