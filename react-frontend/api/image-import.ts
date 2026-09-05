import http from 'node:http';
import { fetchPublicResource } from './_fetch-public-resource';
import { detectImageType } from './_image-type';
import { isAllowedStudioOrigin } from './_studio-origin';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 12_000;

async function hasPortfolioProjectAccess(authorization: string | undefined) {
    if (!authorization?.startsWith('Bearer ')) return false;
    try {
        const response = await fetch('https://api.sanity.io/v2021-06-07/projects/h48br789', {
            headers: { Authorization: authorization },
        });
        return response.ok;
    } catch {
        return false;
    }
}

async function readJsonBody(req: http.IncomingMessage): Promise<string> {
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
    const origin = req.headers.origin;
    if (!isAllowedStudioOrigin(origin)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Origin is not allowed' }));
        return;
    }

    res.setHeader('Access-Control-Allow-Origin', origin!);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
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
    if (!(await hasPortfolioProjectAccess(req.headers.authorization))) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Portfolio Studio access is required' }));
        return;
    }

    try {
        const { url } = JSON.parse(await readJsonBody(req)) as { url?: unknown };
        if (typeof url !== 'string' || !url.trim()) throw new Error('An image URL is required');

        const image = await fetchPublicResource(new URL(url), {
            accept: 'image/avif,image/webp,image/png,image/jpeg,image/gif',
            allowedContentType: (contentType) =>
                contentType.startsWith('image/') || contentType === 'application/octet-stream',
            maxBytes: MAX_IMAGE_BYTES,
            timeoutMs: REQUEST_TIMEOUT_MS,
            userAgent: 'ShawkyEbrahim-ImageImporter/1.0',
        });
        const detectedType = detectImageType(image.body);
        if (!detectedType) throw new Error('Downloaded content is not a supported raster image');

        res.writeHead(200, {
            'Cache-Control': 'private, no-store',
            'Content-Length': String(image.body.length),
            'Content-Type': detectedType,
        });
        res.end(image.body);
    } catch (error) {
        res.writeHead(422, { 'Content-Type': 'application/json' });
        res.end(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'Unable to import image',
            })
        );
    }
}
