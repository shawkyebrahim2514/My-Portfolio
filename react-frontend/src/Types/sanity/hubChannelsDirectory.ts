import type { RemoteImageCrop } from '../../utils/remoteImageCrop';
import { CommonTitle } from './common';
import { HubContentLanguage, HubEntryCategoryRef } from './hubEntry';
import { RichContentNode } from './richContent';

export type HubDirectoryPlatform =
    | 'youtube'
    | 'facebook'
    | 'podcast'
    | 'website'
    | 'github'
    | 'linkedin'
    | 'twitter';

export type HubDirectoryType = 'subscription' | 'creator';

export type SanityHubDirectoryChannel = {
    _key: string;
    type?: HubDirectoryType;
    name: string;
    platform: HubDirectoryPlatform;
    url: string;
    avatar?: string;
    avatarFocus?: RemoteImageCrop;
    coverImage?: string;
    coverFocus?: RemoteImageCrop;
    accentColor?: string;
    note: string;
    language?: HubContentLanguage;
    featured?: boolean;
    hiddenInProduction?: boolean;
    tags?: string[];
    deepDiveSlug?: string;
    deepDiveTitle?: string;
    categories: (HubEntryCategoryRef | null)[];
};

export type SanityHubChannelsDirectoryPage = CommonTitle & {
    intro: RichContentNode[];
    channels: SanityHubDirectoryChannel[];
};
