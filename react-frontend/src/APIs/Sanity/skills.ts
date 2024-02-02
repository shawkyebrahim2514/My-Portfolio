import { SanitySkill } from '../../Types';
import sanityClient from './client';

const getSkills = async () => {
    const query = `*[_type == "skills" && rank >= 0]{
        "categoryName": category->name,
        "iconURL": icon.asset->url,
        name, rank
    }`;
    const result: SanitySkill[] = await sanityClient.fetch(query);
    return result;
};

export {
    getSkills,
}