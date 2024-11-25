import { SanityEducationPage } from '../../Types';
import sanityClient from './client';

const getEducationPage = async () => {
    const query = `*[_type == "portfolio"][0].pages[_type == "educationPage"][0] {
        title,
        education {
            name,
            description,
            location,
            date,
            courses[] -> {
                description,
                "technologies": technologies[]->name
            }
        }
    }`;
    const result: SanityEducationPage = await sanityClient.fetch(query);
    return result;
};

export {
    getEducationPage,
}