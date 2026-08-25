import { SanityAboutPage } from '../../Types';
import sanityClient from './client';
import { directoryChannelFields, withCardCover } from './hub';

const getAboutPage = async () => {
    const query = `*[_type == "portfolio"][0].pages[_type == "aboutPage"][0] {
        personImage,
        circularRingText,
        description,
        resume,
        "featuredFollows": featuredFollows[] {
            ...select(
                defined(_ref) => @->{
                    "_key": coalesce(^._key, _id),
                    ${directoryChannelFields}
                }
            )
        },
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
    const about = await sanityClient.fetch<SanityAboutPage>(query);
    return {
        ...about,
        featuredHubEntries: (about.featuredHubEntries ?? []).map((entry) =>
            entry ? withCardCover(entry) : entry,
        ),
        featuredFollows: about.featuredFollows ?? [],
    };
};

export {
    getAboutPage,
}