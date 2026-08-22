import type { PageContextServer } from 'vike/types';
import { createElement } from 'react';
import { render } from 'vike/abort';
import { useConfig } from 'vike-react/useConfig';
import { getHubEntryBySlug, getHubRecommendations } from '../../../src/APIs';
import { enrichYouTubeBlocks } from '../../../src/utils/youtube';
import type { SanityHubEntry, SanityHubEntrySummary, HubEntryCategoryRef } from '../../../src/Types';

export type HubEntryData = {
    entry: SanityHubEntry;
    recommendations: SanityHubEntrySummary[];
    recommendationCategory?: HubEntryCategoryRef;
};

export async function data(pageContext: PageContextServer): Promise<HubEntryData> {
    // useConfig() must be called before any `await` — the actual config(...)
    // call (setting a per-entry <title>/description) happens after the fetch.
    // Not a React component/hook despite the naming convention — this is
    // Vike's "universal hook" pattern (usable inside +data.ts), which the
    // react-hooks/rules-of-hooks rule doesn't know about.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const config = useConfig();
    const { slug } = pageContext.routeParams;
    const entry = await getHubEntryBySlug(slug);

    if (!entry) {
        throw render(404, `Hub entry not found: ${slug}`);
    }

    // Build-time enrichment: fill each embedded YouTube block's title/channel/
    // thumbnail from the key-free oEmbed endpoint so the rich video card
    // renders straight from the prerendered HTML (no client fetch, no API key).
    if (entry.body) {
        await enrichYouTubeBlocks(entry.body);
    }
    if (entry.channel?.moreVideos) {
        await enrichYouTubeBlocks(entry.channel.moreVideos);
    }

    config({
        title: `${entry.title} — Hub — Shawky Ebrahim`,
        description: entry.excerpt,
        // Reference/dummy entries flagged hidden-in-production are still
        // prerendered (so ?preview=1 can reach them), but must never be indexed
        // by search engines. Bake a noindex robots meta into their <head>.
        ...(entry.hiddenInProduction
            ? {
                  Head: createElement('meta', {
                      name: 'robots',
                      content: 'noindex,nofollow',
                  }),
              }
            : {}),
    });

    // Recommendations come from the entry's primary (first resolvable)
    // category — latest 5, excluding the current entry.
    const recommendationCategory = entry.categories.find(
        (category): category is HubEntryCategoryRef => Boolean(category),
    );
    const recommendations = recommendationCategory
        ? await getHubRecommendations(recommendationCategory.slug, slug)
        : [];

    return { entry, recommendations, recommendationCategory };
}
