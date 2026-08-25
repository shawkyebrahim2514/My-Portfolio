import { SanityAboutPage } from '../../Types';
import sanityClient from './client';
import { getHubChannelsDirectoryPage, withCardCover } from './hub';

const getAboutPage = async () => {
    const query = `*[_type == "portfolio"][0].pages[_type == "aboutPage"][0] {
        personImage,
        circularRingText,
        description,
        resume,
        "featuredHubEntries": featuredInAbout[]-> {
            title,
            "slug": slug.current,
            kind,
            excerpt,
            language,
            "coverImage": coalesce(coverImage.asset->url, coverImage),
            coverFocus,
            "listenPreviewUrl": select(kind == "listen" => body[_type == "listeningItem" && defined(url)][0].url),
            "channel": select(kind == "channel" => {
                "platform": channel.platform,
                "url": channel.url,
                "name": channel.name,
                "channelId": channel.channelId,
                "handle": channel.handle,
                "avatar": channel.avatar
            }),
            durationLabel,
            publishedAt,
            featured,
            hiddenInProduction,
            "accentColor": accent.hex,
            "categories": categories[]->{ title, "slug": slug.current }
        },
    }`;
    const [about, directory] = await Promise.all([
        sanityClient.fetch<SanityAboutPage>(query),
        getHubChannelsDirectoryPage(),
    ]);
    return {
        ...about,
        featuredHubEntries: (about.featuredHubEntries ?? []).map((entry) =>
            entry ? withCardCover(entry) : entry,
        ),
        featuredFollows: (directory?.channels ?? []).filter((item) => item.featuredInAbout),
    };
};

export {
    getAboutPage,
}