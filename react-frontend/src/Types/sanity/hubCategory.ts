// Mirrors sanity-backend/schemas/hub/hubCategory.ts.
export type SanityHubCategory = {
    title: string;
    slug: string;
    description?: string;
    accentColor: 'base' | 'secondary';
    icon?: string;
};
