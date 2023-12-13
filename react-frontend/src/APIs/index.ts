import { createClient } from '@sanity/client'
import {
    type SanitySkill,
    type SanityEducationCourse,
    type SanityInternship,
    type SanityProject,
    type SanityContact
} from '../Types';
import { SanityCertificate } from '../Types/sanity';


const sanityClient = createClient({
    projectId: 'h48br789',
    dataset: 'production',
    useCdn: true
})

const getSkills = async () => {
    const query = `*[_type == "skills"]{
        "categoryName": category->name,
        "iconURL": icon.asset->url,
        name, rank
    }`;
    const result: SanitySkill[] = await sanityClient.fetch(query);
    return result;
};

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

const getContacts = async () => {
    const query = `*[_type == "contacts"]{
        "imgSrc": icon.asset->url,
        link,
        name
    }`;
    const result: SanityContact[] = await sanityClient.fetch(query);
    return result;
};

const getCertificates = async () => {
    const query = `*[_type == "certificates"]{
        title,
        subTitle,
        rank,
        description,
        date,
        link,
    }`;
    const result: SanityCertificate[] = await sanityClient.fetch(query);
    return result;
};

const getGithubImageURL = (username: string) => `https://avatars.githubusercontent.com/${username}`;

const getResumeURL = () => `https://drive.google.com/drive/folders/1yJmOWWaRQpM32haB8CeXCOzK0_WC6o59`;

export { getGithubImageURL, getResumeURL };

export {
    getSkills,
    getEducationCourses,
    getInternships,
    getProjects,
    getContacts,
    getCertificates
};