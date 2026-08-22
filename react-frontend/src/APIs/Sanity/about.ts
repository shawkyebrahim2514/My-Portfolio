import { SanityAboutPage } from '../../Types';
import sanityClient from './client';

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
            "coverImage": coverImage.asset->url,
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
    const result: SanityAboutPage = await sanityClient.fetch(query);
    return result;
};

export {
    getAboutPage,
}