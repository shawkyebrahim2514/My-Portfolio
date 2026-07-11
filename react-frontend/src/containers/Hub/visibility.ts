import type { SanityHubEntrySummary } from '../../Types';

// Drops entries flagged `hiddenInProduction` unless preview mode is on. Used at
// every listing surface (Hub index, category page, About teaser,
// recommendations) so hidden reference/dummy entries stay out of the live site
// but remain visible locally and via ?preview=1.
export function filterVisible<T extends Pick<SanityHubEntrySummary, 'hiddenInProduction'>>(
    entries: T[],
    isPreview: boolean,
): T[] {
    if (isPreview) return entries;
    return entries.filter((entry) => !entry.hiddenInProduction);
}
