import { CommonTitle } from './common';
import { HubContentLanguage } from './hubEntry';
import { RichContentNode } from './richContent';

export type SanityHubLibraryCollection = {
    title: string;
    slug: string;
    description?: string;
    order?: number;
};

export type SanityHubLibrarySave = {
    _key: string;
    title: string;
    url: string;
    note: string;
    language?: HubContentLanguage;
    featured?: boolean;
    hiddenInProduction?: boolean;
    tags?: string[];
    collection: {
        title: string;
        slug: string;
    } | null;
};

export type SanityHubLibraryPage = CommonTitle & {
    intro: RichContentNode[];
};
