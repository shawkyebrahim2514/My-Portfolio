import { lookup } from 'node:dns/promises';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';

type FetchPublicResourceOptions = {
    accept: string;
    allowedContentType: (contentType: string) => boolean;
    maxBytes: number;
    timeoutMs: number;
    userAgent: string;
};

export type PublicResource = {
    body: Buffer;
    contentType: string;
    finalUrl: URL;
};

const blockedIpv4 = new net.BlockList();
for (const [network, prefix] of [
    ['0.0.0.0', 8],
    ['10.0.0.0', 8],
    ['100.64.0.0', 10],
    ['127.0.0.0', 8],
    ['169.254.0.0', 16],
    ['172.16.0.0', 12],
    ['192.0.0.0', 24],
    ['192.0.2.0', 24],
    ['192.88.99.0', 24],
    ['192.168.0.0', 16],
    ['198.18.0.0', 15],
    ['198.51.100.0', 24],
    ['203.0.113.0', 24],
    ['224.0.0.0', 4],
    ['240.0.0.0', 4],
] as const) {
    blockedIpv4.addSubnet(network, prefix, 'ipv4');
}
const blockedIpv6 = new net.BlockList();
for (const [network, prefix] of [
    ['::', 96],
    ['::ffff:0:0', 96],
    ['64:ff9b::', 96],
    ['64:ff9b:1::', 48],
    ['100::', 64],
    ['2001::', 32],
    ['2001:db8::', 32],
    ['2002::', 16],
    ['fc00::', 7],
    ['fe80::', 10],
    ['fec0::', 10],
    ['ff00::', 8],
] as const) {
    blockedIpv6.addSubnet(network, prefix, 'ipv6');
}

export function isPublicIp(address: string): boolean {
    const family = net.isIP(address);
    if (family === 4) return !blockedIpv4.check(address, 'ipv4');
    if (family === 6) return !blockedIpv6.check(address, 'ipv6');
    return false;
}

async function resolvePublicAddress(hostname: string): Promise<string> {
    if (net.isIP(hostname)) throw new Error('IP-address URLs are not supported');
    const addresses = await lookup(hostname, { all: true, verbatim: true });
    const publicAddress = addresses.find(({ address }) => isPublicIp(address));
    if (!publicAddress) throw new Error('URL must resolve to a public address');
    return publicAddress.address;
}

export async function fetchPublicResource(
    url: URL,
    options: FetchPublicResourceOptions,
    redirects = 0
): Promise<PublicResource> {
    if (redirects > 4) throw new Error('Too many redirects');
    if (!['http:', 'https:'].includes(url.protocol))
        throw new Error('Only HTTP(S) URLs are supported');
    if (url.port && !['80', '443'].includes(url.port))
        throw new Error('Only standard web ports are supported');

    const address = await resolvePublicAddress(url.hostname);
    const request = url.protocol === 'https:' ? https.request : http.request;

    return new Promise<PublicResource>((resolve, reject) => {
        let settled = false;
        const fail = (error: Error) => {
            if (settled) return;
            settled = true;
            reject(error);
        };

        const req = request(
            {
                protocol: url.protocol,
                hostname: url.hostname,
                port: url.port,
                path: `${url.pathname}${url.search}`,
                headers: {
                    Accept: options.accept,
                    'User-Agent': options.userAgent,
                },
                lookup: (_hostname, lookupOptions, callback) => {
                    const family = net.isIP(address) as 4 | 6;
                    callback(
                        null,
                        lookupOptions.all ? ([{ address, family }] as never) : address,
                        family
                    );
                },
            },
            (res) => {
                const status = res.statusCode ?? 500;
                const location = res.headers.location;
                if ([301, 302, 303, 307, 308].includes(status) && location) {
                    res.resume();
                    settled = true;
                    fetchPublicResource(new URL(location, url), options, redirects + 1).then(
                        resolve,
                        reject
                    );
                    return;
                }
                if (status < 200 || status >= 300) {
                    res.resume();
                    fail(new Error(`Source returned HTTP ${status}`));
                    return;
                }

                const contentType = String(res.headers['content-type'] ?? '')
                    .split(';', 1)[0]
                    .trim()
                    .toLowerCase();
                if (!options.allowedContentType(contentType)) {
                    res.resume();
                    fail(new Error(`Unsupported response type: ${contentType || 'unknown'}`));
                    return;
                }

                const contentLength = Number(res.headers['content-length'] ?? 0);
                if (contentLength > options.maxBytes) {
                    res.resume();
                    fail(new Error('Remote file is too large'));
                    return;
                }

                const chunks: Buffer[] = [];
                let size = 0;
                res.on('data', (chunk: Buffer) => {
                    size += chunk.length;
                    if (size > options.maxBytes) {
                        fail(new Error('Remote file is too large'));
                        req.destroy();
                        return;
                    }
                    chunks.push(chunk);
                });
                res.on('end', () => {
                    if (settled) return;
                    settled = true;
                    resolve({
                        body: Buffer.concat(chunks),
                        contentType,
                        finalUrl: url,
                    });
                });
                res.on('error', fail);
            }
        );
        req.setTimeout(options.timeoutMs, () => {
            fail(new Error('Remote request timed out'));
            req.destroy();
        });
        req.on('error', fail);
        req.end();
    });
}
