import { SanityInternship } from '../../Types';
import sanityClient from './client';

const getInternships = async () => {
    const query = `*[_type == "internships"]{
        title,
        subTitle,
        rank,
        date,
        link,
        description,
        "technologies": technologies[]->name
    }`;
    const result: SanityInternship[] = await sanityClient.fetch(query);
    return result;
};

export {
    getInternships,
}