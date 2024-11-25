import { CommonTitle } from "./common";

type Links = {
    demoLink: string;
    projectLink: string;
}

type Project = {
    links: Links;
    description: string;
    imgSrc: string;
    technologies: string[];
}

export type SanityProjectsPage = CommonTitle & {
    projects: Project[];
}