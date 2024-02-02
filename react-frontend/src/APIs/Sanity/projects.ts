import { SanityProject } from '../../Types';
import sanityClient from './client';

const getProjects = async () => {
    const query = `*[_type == "projects"]{
        name,
        rank,
        links,
        description,
        "imgSrc": image.asset->url,
        "technologies": technologies[]->name
    }`;
    const result: SanityProject[] = await sanityClient.fetch(query);
    return result;
};

export {
    getProjects,
}