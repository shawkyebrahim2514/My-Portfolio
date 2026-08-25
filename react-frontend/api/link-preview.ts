import { lookup } from 'node:dns/promises';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';

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

function isPublicIp(address: string): boolean {
    if (net.isIPv4(address)) {
        const [a, b] = address.split('.').map(Number);
        return !(
            a === 0 ||
            a === 10 ||
            a === 127 ||
            (a === 100 && b >= 64 && b <= 127) ||
            (a === 169 && b === 254) ||
            (a === 172 && b >= 16 && b <= 31) ||
            (a === 192 && b === 168) ||
            (a === 198 && (b === 18 || b === 19)) ||
            a >= 224
        );
    }

    const normalized = address.toLowerCase();
    return !(
        normalized === '::' ||
        normalized === '::1' ||
        normalized.startsWith('fc') ||
        normalized.startsWith('fd') ||
        normalized.startsWith('fe80:')
    );
}

async function resolvePublicAddress(hostname: string): Promise<string> {
    if (net.isIP(hostname)) throw new Error('IP-address URLs are not supported');
    const addresses = await lookup(hostname, { all: true, verbatim: true });
    const publicAddress = addresses.find(({ address }) => isPublicIp(address));
    if (!publicAddress) throw new Error('URL must resolve to a public address');
    return publicAddress.address;
}

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

async function fetchPage(url: URL, redirects = 0): Promise<Preview> {
    if (redirects > 4) throw new Error('Too many redirects');
    if (!['http:', 'https:'].includes(url.protocol))
        throw new Error('Only HTTP(S) URLs are supported');
    if (url.port && !['80', '443'].includes(url.port))
        throw new Error('Only standard web ports are supported');

    const address = await resolvePublicAddress(url.hostname);
    const request = url.protocol === 'https:' ? https.request : http.request;

    return new Promise<Preview>((resolve, reject) => {
        const req = request(
            {
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port,
                path: `${url.pathname}${url.search}`,
                headers: {
                    Accept: 'text/html,application/xhtml+xml',
                    'User-Agent': 'ShawkyEbrahim-LinkPreview/1.0',
                },
                lookup: (_hostname, options, callback) => {
                    const family = net.isIP(address) as 4 | 6;
                    callback(
                        null,
                        options.all ? ([{ address, family }] as never) : address,
                        family
                    );
                },
            },
            (res) => {
                const status = res.statusCode ?? 500;
                const location = res.headers.location;
                if ([301, 302, 303, 307, 308].includes(status) && location) {
                    res.resume();
                    fetchPage(new URL(location, url), redirects + 1).then(resolve, reject);
                    return;
                }
                if (status < 200 || status >= 300) {
                    res.resume();
                    reject(new Error(`Source returned HTTP ${status}`));
                    return;
                }
                if (!res.headers['content-type']?.includes('text/html')) {
                    res.resume();
                    reject(new Error('URL did not return an HTML page'));
                    return;
                }

                const chunks: Buffer[] = [];
                let size = 0;
                res.on('data', (chunk: Buffer) => {
                    size += chunk.length;
                    if (size > MAX_RESPONSE_BYTES) {
                        req.destroy(new Error('Page is too large to preview'));
                        return;
                    }
                    chunks.push(chunk);
                });
                res.on('end', () =>
                    resolve(parsePreview(Buffer.concat(chunks).toString('utf8'), url))
                );
            }
        );
        req.setTimeout(REQUEST_TIMEOUT_MS, () =>
            req.destroy(new Error('Preview request timed out'))
        );
        req.on('error', reject);
        req.end();
    });
}

export default async function handler(req: http.IncomingMessage, res: http.ServerResponse) {
    const studioOrigin = process.env.SANITY_STUDIO_ORIGIN;
    const origin = req.headers.origin;
    const isLocalStudio = Boolean(origin && /^http:\/\/localhost(?::\d+)?$/.test(origin));
    const isConfiguredStudio = Boolean(origin && studioOrigin && origin === studioOrigin);
    if (origin && !isLocalStudio && !isConfiguredStudio) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Origin is not allowed' }));
        return;
    }
    if (origin && (isLocalStudio || isConfiguredStudio)) res.setHeader('Access-Control-Allow-Origin', origin);
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
