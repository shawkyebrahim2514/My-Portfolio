import { extractYouTubeId } from './youtube';

export type EpisodeProvider = 'spotify' | 'youtube' | 'apple' | 'soundcloud' | 'anghami' | 'other';

export type EpisodeEmbed = {
    provider: EpisodeProvider;
    // A ready-to-use iframe src when the episode can play inline; otherwise
    // undefined and the caller should link out to `url` instead.
    embedUrl?: string;
};

// Turns an open.spotify.com link into its embeddable form:
// https://open.spotify.com/episode/<id>  ->  https://open.spotify.com/embed/episode/<id>
// Handles episode/show/track and locale-prefixed paths (e.g. /intl-ar/episode/…).
// The Spotify embed iframe is fully self-contained (cover, title, play) and
// needs no API key, so this is derived purely from the URL string.
export function extractSpotifyEmbed(url: string): string | undefined {
    const m = url.match(/open\.spotify\.com\/(?:[a-z-]+\/)?(episode|show|track|playlist)\/([a-zA-Z0-9]+)/);
    if (!m) return undefined;
    const [, type, id] = m;
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
}

// Detects the podcast platform of a link that we don't play inline, purely so
// the episode card can show the right brand icon. Returns 'other' for anything
// unrecognised (rendered with a generic headphones glyph).
function detectLinkOutProvider(url: string): EpisodeProvider {
    if (/podcasts\.apple\.com|apple\.co/i.test(url)) return 'apple';
    if (/soundcloud\.com|snd\.sc/i.test(url)) return 'soundcloud';
    if (/anghami\.com/i.test(url)) return 'anghami';
    return 'other';
}

// Resolves a podcast-episode URL to a provider + inline embed URL. Spotify and
// YouTube links play inline (both key-free); other known platforms (Apple,
// SoundCloud, Anghami) resolve to their brand for the card icon but link out
// (no embedUrl); anything else is 'other' and also links out.
export function resolveEpisodeEmbed(url: string): EpisodeEmbed {
    const spotify = extractSpotifyEmbed(url);
    if (spotify) return { provider: 'spotify', embedUrl: spotify };

    const ytId = extractYouTubeId(url);
    if (ytId) {
        return {
            provider: 'youtube',
            embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`,
        };
    }

    return { provider: detectLinkOutProvider(url) };
}
