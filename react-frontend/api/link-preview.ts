import http from 'node:http';
import { fetchPublicResource } from './_fetch-public-resource';
import { isAllowedStudioOrigin } from './_studio-origin';

type Preview = {
    url: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    siteName?: string;
    faviconUrl?: string;
};

const MAX_RESPONSE_BYTES = 750_000;
const REQUEST_TIMEOUT_MS = 6_000;

function getAttribute(tag: string, name: string): string | undefined {
    const match = tag.match(
        new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i')
    );
    return match?.[1] ?? match?.[2] ?? match?.[3];
}

function decodeHtml(value: string): string {
    return value
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

function metaValue(html: string, names: string[]): string | undefined {
    for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
        const key = getAttribute(tag, 'property') ?? getAttribute(tag, 'name');
        const content = getAttribute(tag, 'content');
        if (key && content && names.includes(key.toLowerCase())) return decodeHtml(content);
    }
    return undefined;
}

function absoluteUrl(value: string | undefined, base: URL): string | undefined {
    if (!value) return undefined;
    try {
        const url = new URL(value, base);
        return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
    } catch {
        return undefined;
    }
}

function parsePreview(html: string, url: URL): Preview {
    const title =
        metaValue(html, ['og:title', 'twitter:title']) ??
        html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1].replace(/<[^>]+>/g, '');
    const description = metaValue(html, ['og:description', 'twitter:description', 'description']);
    const imageUrl = absoluteUrl(metaValue(html, ['og:image', 'twitter:image']), url);
    const favicon = html.match(
        /<link\b[^>]*rel\s*=\s*(?:"[^"]*icon[^"]*"|'[^']*icon[^']*'|icon)[^>]*>/i
    )?.[0];

    return {
        url: url.toString(),
        title: title ? decodeHtml(title) : undefined,
        description,
        imageUrl,
        siteName: metaValue(html, ['og:site_name']) ?? url.hostname.replace(/^www\./, ''),
        faviconUrl:
            absoluteUrl(getAttribute(favicon ?? '', 'href'), url) ??
            new URL('/favicon.ico', url).toString(),
    };
}

async function fetchPage(url: URL): Promise<Preview> {
    const resource = await fetchPublicResource(url, {
        accept: 'text/html,application/xhtml+xml',
        allowedContentType: (contentType) => contentType === 'text/html',
        maxBytes: MAX_RESPONSE_BYTES,
        timeoutMs: REQUEST_TIMEOUT_MS,
        userAgent: 'ShawkyEbrahim-LinkPreview/1.0',
    });
    return parsePreview(resource.body.toString('utf8'), resource.finalUrl);
}

export default async function handler(req: http.IncomingMessage, res: http.ServerResponse) {
    const origin = req.headers.origin;
    if (!isAllowedStudioOrigin(origin, { allowMissing: true })) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Origin is not allowed' }));
        return;
    }
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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

    const body = await new Promise<string>((resolve, reject) => {
        let value = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            value += chunk;
            if (value.length > 4_096) req.destroy(new Error('Request is too large'));
        });
        req.on('end', () => resolve(value));
        req.on('error', reject);
    });

    try {
        const { url } = JSON.parse(body) as { url?: unknown };
        if (typeof url !== 'string') throw new Error('A URL is required');
        const preview = await fetchPage(new URL(url));
        res.writeHead(200, {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
            'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(preview));
    } catch (error) {
        res.writeHead(422, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'Unable to resolve preview',
            })
        );
    }
}
