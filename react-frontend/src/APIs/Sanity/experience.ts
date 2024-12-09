import { SanityExperiencePage } from '../../Types';
import sanityClient from './client';

const getExperiencePage = async () => {
    const query = `*[_type == "portfolio"][0].pages[_type == "experiencePage"][0] {
        professionalExperienceSection {
            title,
            professionalExperience[] -> {
                description,
                "technologies": technologies[]->name
            }
        },
        internshipsSection {
            title,
            internships[] -> {
                description,
                "technologies": technologies[]->name
            }
        },
        certificatesSection {
            title,
            certificates[] -> {
                description,
            }
        }
    }`;
    const result: SanityExperiencePage = await sanityClient.fetch(query);
    return result;
};

export {
    getExperiencePage,
}