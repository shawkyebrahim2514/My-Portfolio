export type ClarityPageTags = {
    page: string;
    path: string;
    preview?: string;
    hub_kind?: string;
    hub_source?: string;
    hub_type?: string;
    hub_category?: string;
};

export function pageArea(pathname: string): string {
    const path = pathname.replace(/\/+$/, '') || '/';
    if (path === '/') return 'about';
    if (path === '/hub') return 'hub';
    if (path === '/hub/follows') return 'hub-follows';
    if (path.startsWith('/hub/category/')) return 'hub-category';
    if (path.startsWith('/hub/')) return 'hub-entry';
    return path.slice(1).split('/')[0] || 'about';
}

export function buildPageTags(
    pathname: string,
    search = '',
    options?: { preview?: boolean; hubKind?: string },
): ClarityPageTags {
    const tags: ClarityPageTags = {
        page: pageArea(pathname),
        path: pathname || '/',
    };
    if (options?.preview) tags.preview = 'true';
    if (options?.hubKind) tags.hub_kind = options.hubKind;

    const params = new URLSearchParams(search);
    const source = params.get('source');
    const type = params.get('type');
    const category = params.get('category');
    if (source) tags.hub_source = source;
    if (type) tags.hub_type = type;
    if (category) tags.hub_category = category;
    return tags;
}
