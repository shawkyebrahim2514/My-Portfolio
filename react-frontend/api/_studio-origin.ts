const KNOWN_STUDIO_ORIGINS = new Set([
    'https://portfolio.sanity.studio',
    'https://shawkyebrahim.sanity.studio',
]);

export function isAllowedStudioOrigin(
    origin: string | undefined,
    options: { allowMissing?: boolean } = {}
): boolean {
    if (!origin) return options.allowMissing ?? false;
    if (/^http:\/\/localhost(?::\d+)?$/.test(origin)) return true;
    if (KNOWN_STUDIO_ORIGINS.has(origin)) return true;

    return (process.env.SANITY_STUDIO_ORIGIN ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
        .includes(origin);
}
