import { SanitySkillsPage } from '../../Types';
import sanityClient from './client';

const getSkillsPage = async () => {
    const query = `*[_type == "portfolio"][0].pages[_type == "skillsPage"][0] {
        title,
        "categories": categories[] {
            title,
            skills[] -> {
                "iconURL": icon.asset->url,
                name
            }
        }
    }`;
    const result: SanitySkillsPage = await sanityClient.fetch(query);
    return result;
};

export {
    getSkillsPage,
}