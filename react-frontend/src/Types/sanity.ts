export type TechnologyCategory = "General" | "Frontend" | "Backend" | "Databases" | "Tools";

export type SanitySkill = {
    name: string;
    rank: number;
    categoryName: TechnologyCategory;
    iconURL: string;
}

export type SanityEducationCourse = {
    name: string;
    rank: number;
    description: string;
    technologies: string[];
}

export type SanityInternship = {
    title: string;
    subTitle: string;
    rank: number;
    date: {
        from: string;
        to: string;
    }
    link: string;
    description: string;
    technologies: string[];
}

export type SanityProject = {
    name: string; // title
    rank: number;
    links: {
        demoLink: string;
        projectLink: string;
    }
    description: string;
    imgSrc: string;
    technologies: string[];
}

export type SanityContact = {
    imgSrc: string;
    link: string;
    name: string;
}
