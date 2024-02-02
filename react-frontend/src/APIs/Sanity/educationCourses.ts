import { SanityEducationCourse } from '../../Types';
import sanityClient from './client';

const getEducationCourses = async () => {
    const query = `*[_type == "collegeCourses"]{
        name,
        rank,
        description,
        "technologies": technologies[]->name
    }`;
    const result: SanityEducationCourse[] = await sanityClient.fetch(query);
    return result;
};

export {
    getEducationCourses,
}