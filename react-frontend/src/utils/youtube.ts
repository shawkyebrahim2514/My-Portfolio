import type { RichContentNode, RichCuratedVideo, RichYouTube } from '../Types';

// Extracts an 11-char video ID from any common YouTube URL form:
// watch?v=…, youtu.be/…, /embed/…, /shorts/…, /live/….
export function extractYouTubeId(url: string): string | undefined {
    const patterns = [
        /[?&]v=([a-zA-Z0-9_-]{11})/,
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /\/embed\/([a-zA-Z0-9_-]{11})/,
        /\/shorts\/([a-zA-Z0-9_-]{11})/,
        /\/live\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const re of patterns) {
        const m = url.match(re);
        if (m) return m[1];
    }
    return undefined;
}

type OEmbedResponse = {
    title?: string;
    author_name?: string;
    author_url?: string;
    thumbnail_url?: string;
};

// Enriches a single YouTube block in place using YouTube's key-free oEmbed
// endpoint (title + channel + thumbnail). Called at build time from the hub
// detail +data loader — runs in Node, so no CORS and no API key. On any
// failure the block still has videoId + a fallback thumbnail, so the card
// degrades gracefully to thumbnail + play + caption.
async function enrichBlock(node: RichYouTube | RichCuratedVideo): Promise<void> {
    const videoId = extractYouTubeId(node.url);
    if (!videoId) return;
    node.videoId = videoId;
    node.thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    try {
        const res = await fetch(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(node.url)}&format=json`,
        );
        if (!res.ok) return;
        const data: OEmbedResponse = await res.json();
        node.videoTitle = data.title;
        node.channelTitle = data.author_name;
        node.channelUrl = data.author_url;
        if (data.thumbnail_url) node.thumbnail = data.thumbnail_url;
    } catch {
        /* keep the fallback thumbnail */
    }
}

// Walks a Portable Text body (including nested rich bodies) and enriches
// every YouTube block. Mutates in place and returns the same array for
// convenience. Safe to call on any body — a no-op when there are no videos.
export async function enrichYouTubeBlocks(body: RichContentNode[]): Promise<RichContentNode[]> {
    if (!Array.isArray(body)) return body;
    const tasks: Promise<void>[] = [];
    for (const node of body) {
        if (node._type === 'youtube') {
            tasks.push(enrichBlock(node as RichYouTube));
        } else if (node._type === 'curatedVideo') {
            tasks.push(enrichBlock(node));
            if (Array.isArray(node.companionContent)) {
                tasks.push(enrichYouTubeBlocks(node.companionContent).then(() => undefined));
            }
        } else if (
            (node._type === 'callout' ||
                node._type === 'note' ||
                node._type === 'expandableDetails') &&
            Array.isArray(node.body)
        ) {
            tasks.push(enrichYouTubeBlocks(node.body).then(() => undefined));
        }
    }
    await Promise.all(tasks);
    return body;
}
