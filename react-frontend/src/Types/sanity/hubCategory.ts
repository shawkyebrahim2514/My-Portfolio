// Mirrors sanity-backend/schemas/hub/hubCategory.ts.
// `icon` is a sanity-plugin-icon-manager (`icon.manager`) value; we only
// project the fields needed to render it on the frontend. `metadata.inlineSvg`
// holds the icon's SVG markup (stored on the doc because the Studio plugin is
// configured with `inlineSvg: true`), so it can be rendered with no runtime
// icon library and works with static prerendering.
export type SanityIconManagerValue = {
    icon?: string;
    metadata?: {
        inlineSvg?: string;
        iconName?: string;
    };
};

export type SanityHubCategory = {
    title: string;
    slug: string;
    description?: string;
    accentColor: 'base' | 'secondary';
    icon?: SanityIconManagerValue;
};
