import { CommonTitle } from "./common";

type Links = {
    demoLink: string;
    projectLink: string;
}

type Project = {
    name: string;
    links: Links;
    description: string;
    imgSrc: string;
    technologies: string[];
}

export type SanityProjectsPage = CommonTitle & {
    projects: Project[];
}