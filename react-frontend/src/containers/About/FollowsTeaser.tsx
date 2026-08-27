import { memo } from 'react';
import { faGlobe, faPodcast, faRss, faUser } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faGithub, faLinkedin, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { filterVisible } from '../Hub/visibility';
import { useIsPreview } from '../../contexts/PreviewContext';
import type { HubDirectoryPlatform, HubDirectoryType, SanityHubDirectoryChannel } from '../../Types';
import MagazineTeaser from './MagazineTeaser';

type FollowsTeaserProps = {
    readonly follows: (SanityHubDirectoryChannel | null)[];
};

const PLATFORM_META: Record<HubDirectoryPlatform, { label: string; icon: IconDefinition }> = {
    youtube: { label: 'YouTube', icon: faYoutube },
    github: { label: 'GitHub', icon: faGithub },
    linkedin: { label: 'LinkedIn', icon: faLinkedin },
    facebook: { label: 'Facebook', icon: faFacebook },
    podcast: { label: 'Podcasts', icon: faPodcast },
    website: { label: 'Website', icon: faGlobe },
    twitter: { label: 'Twitter (X)', icon: faXTwitter },
};

const PLATFORM_ACCENT: Record<HubDirectoryPlatform, string> = {
    youtube: '#e11d48',
    github: '#111827',
    linkedin: '#0a66c2',
    facebook: '#1877f2',
    podcast: '#6d5ae6',
    website: '#2563eb',
    twitter: '#111827',
};

const TYPE_META: Record<HubDirectoryType, { label: string; icon: IconDefinition }> = {
    subscription: { label: 'Subscription', icon: faRss },
    creator: { label: 'Creator', icon: faUser },
};

function resolveType(follow: SanityHubDirectoryChannel): HubDirectoryType {
    if (follow.type === 'subscription' || follow.type === 'creator') return follow.type;
    return ['github', 'linkedin', 'facebook', 'twitter'].includes(follow.platform)
        ? 'creator'
        : 'subscription';
}

function FollowsTeaser({ follows }: FollowsTeaserProps) {
    const isPreview = useIsPreview();
    const resolvedFollows = filterVisible(
        follows.filter((follow): follow is SanityHubDirectoryChannel => Boolean(follow)),
        isPreview,
    );

    return (
        <MagazineTeaser
            title="Worth Following"
            subtitle="Picked by me · People and channels I follow"
            ctaHref="/hub/follows"
            ctaLabel="See who I follow"
            ctaEvent="followsCta"
            variant="people"
            items={resolvedFollows.map((follow) => {
                const platform = PLATFORM_META[follow.platform];
                const type = TYPE_META[resolveType(follow)];
                const href = follow.deepDiveSlug ? `/hub/${follow.deepDiveSlug}` : follow.url;
                return {
                    key: follow._key,
                    href,
                    external: !follow.deepDiveSlug,
                    title: follow.name,
                    excerpt: follow.note,
                    image: follow.coverImage,
                    coverFocus: follow.coverFocus,
                    avatar: follow.avatar,
                    avatarFocus: follow.avatarFocus,
                    accent: follow.accentColor ?? PLATFORM_ACCENT[follow.platform],
                    badgeIcon: platform?.icon ?? type.icon,
                    badgeLabel: platform?.label ?? type.label,
                    language: follow.language,
                    hidden: follow.hiddenInProduction,
                };
            })}
        />
    );
}

export default memo(FollowsTeaser);
