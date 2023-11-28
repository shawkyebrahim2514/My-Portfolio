import { createClient } from '@sanity/client'

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
    const result = await sanityClient.fetch(query);
    return result;
};

const getEducationCourses = async () => {
    const query = `*[_type == "collegeCourses"]{
        name,
        rank,
        description,
        "languages": languages[]->name
    }`;
    const result = await sanityClient.fetch(query);
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
        "languages": languages[]->name
    }`;
    const result = await sanityClient.fetch(query);
    return result;
};

const getProjects = async () => {
    const query = `*[_type == "projects"]{
        name,
        rank,
        links,
        description,
        "imgSrc": image.asset->url,
        "languages": languages[]->name
    }`;
    const result = await sanityClient.fetch(query);
    return result;
};

const getContacts = async () => {
    const query = `*[_type == "contacts"]{
        "imgSrc": icon.asset->url,
        link,
        name
    }`;
    const result = await sanityClient.fetch(query);
    return result;
};

const githubImageURL = (username) => `https://avatars.githubusercontent.com/${username}`;

export { githubImageURL };

export { getSkills, getEducationCourses, getInternships, getProjects, getContacts };