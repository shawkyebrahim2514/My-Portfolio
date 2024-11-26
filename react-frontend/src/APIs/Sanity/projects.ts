import { SanityProjectsPage } from '../../Types';
import sanityClient from './client';

const getProjectsPage = async () => {
    const query = `*[_type == "portfolio"][0].pages[_type == "projectsPage"][0] {
        title,
        "projects": projects[] -> {
            links,
            description,
            "imgSrc": image.asset->url,
            "technologies": technologies[]->name
        }
    }`;
    const result: SanityProjectsPage = await sanityClient.fetch(query);
    return result;
};

export {
    getProjectsPage,
}