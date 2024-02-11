import { SanityAboutPage } from '../../Types';
import sanityClient from './client';

const getAboutPage = async () => {
    const query = `*[_type == "portfolio"][0].pages[_type == "aboutPage"][0] {
        salutation,
        personImage,
        seeking,
        personName,
        description,
        resume,
        position
    }`;
    const result: SanityAboutPage = await sanityClient.fetch(query);
    return result;
};

export {
    getAboutPage,
}