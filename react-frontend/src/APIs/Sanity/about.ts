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
            "coverImage": coverImage.asset->url,
            sourceThumbnail,
            sourceName,
            durationLabel,
            externalUrl,
            publishedAt,
            featured,
            "categories": categories[]->{ title, "slug": slug.current }
        },
    }`;
    const result: SanityAboutPage = await sanityClient.fetch(query);
    return result;
};

export {
    getAboutPage,
}