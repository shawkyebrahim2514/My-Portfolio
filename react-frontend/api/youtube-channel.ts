import http from 'node:http';
import { isAllowedStudioOrigin } from './_studio-origin';

type YouTubeChannel = {
    name: string;
    channelId: string;
    handle?: string;
    url: string;
    avatarUrl?: string;
};

type YouTubeChannelResponse = {
    items?: Array<{
        id?: string;
        snippet?: {
            title?: string;
            customUrl?: string;
            thumbnails?: Record<string, { url?: string }>;
        };
    }>;
    error?: {
        message?: string;
    };
};

function allowStudioOrigin(req: http.IncomingMessage, res: http.ServerResponse): boolean {
    const origin = req.headers.origin;

    if (!isAllowedStudioOrigin(origin)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Origin is not allowed' }));
        return false;
    }

    res.setHeader('Access-Control-Allow-Origin', origin!);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return true;
}

function channelLookup(urlValue: string): { parameter: string; value: string } {
    const url = new URL(urlValue);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    if (hostname !== 'youtube.com' && hostname !== 'm.youtube.com') {
        throw new Error('Use a youtube.com channel URL');
    }

    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0]?.startsWith('@')) {
        return { parameter: 'forHandle', value: parts[0] };
    }
    if (parts[0] === 'channel' && parts[1]) {
        return { parameter: 'id', value: parts[1] };
    }
    if (parts[0] === 'user' && parts[1]) {
        return { parameter: 'forUsername', value: parts[1] };
    }
    throw new Error('Use a YouTube /@handle, /channel/ID, or /user/name URL');
}

function bestThumbnail(thumbnails?: Record<string, { url?: string }>): string | undefined {
    const url =
        thumbnails?.maxres?.url ??
        thumbnails?.high?.url ??
        thumbnails?.medium?.url ??
        thumbnails?.default?.url;
    return url?.replace('https://yt3.ggpht.com/', 'https://yt3.googleusercontent.com/');
}

async function readBody(req: http.IncomingMessage): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let value = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            value += chunk;
            if (value.length > 4_096) req.destroy(new Error('Request is too large'));
        });
        req.on('end', () => resolve(value));
        req.on('error', reject);
    });
}

export default async function handler(req: http.IncomingMessage, res: http.ServerResponse) {
    if (!allowStudioOrigin(req, res)) return;
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    try {
        const apiKey = process.env.YOUTUBE_DATA_API_KEY;
        if (!apiKey) throw new Error('YouTube channel metadata is not configured');

        const { url } = JSON.parse(await readBody(req)) as { url?: unknown };
        if (typeof url !== 'string') throw new Error('A channel URL is required');
        const lookup = channelLookup(url);
        const params = new URLSearchParams({
            part: 'snippet',
            [lookup.parameter]: lookup.value,
            key: apiKey,
        });
        const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`, {
            headers: { Accept: 'application/json' },
            signal: AbortSignal.timeout(6_000),
        });
        const data = (await response.json()) as YouTubeChannelResponse;
        if (!response.ok) {
            throw new Error(data.error?.message || `YouTube returned HTTP ${response.status}`);
        }

        const item = data.items?.[0];
        const channelId = item?.id;
        const name = item?.snippet?.title;
        if (!channelId || !name) throw new Error('No YouTube channel was found for this URL');
        const customUrl = item.snippet?.customUrl;
        const handle = customUrl?.startsWith('@') ? customUrl : undefined;
        const channel: YouTubeChannel = {
            name,
            channelId,
            handle,
            url: handle
                ? `https://www.youtube.com/${handle}`
                : `https://www.youtube.com/channel/${channelId}`,
            avatarUrl: bestThumbnail(item.snippet?.thumbnails),
        };

        res.writeHead(200, {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
            'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(channel));
    } catch (error) {
        res.writeHead(422, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'Unable to resolve YouTube channel',
            })
        );
    }
}
