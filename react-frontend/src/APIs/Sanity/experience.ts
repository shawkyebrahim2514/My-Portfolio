import { SanityExperiencePage } from '../../Types';
import sanityClient from './client';

const getExperiencePage = async () => {
    const query = `*[_type == "portfolio"][0].pages[_type == "experiencePage"][0] {
        internshipsSection {
            title,
            internships[] -> {
                title,
                subTitle,
                date,
                link,
                description,
                "technologies": technologies[]->name
            }
        },
        certificatesSection {
            title,
            certificates[] -> {
                title,
                subTitle,
                description,
                date,
                link,
            }
        }
    }`;
    const result: SanityExperiencePage = await sanityClient.fetch(query);
    return result;
};

export {
    getExperiencePage,
}