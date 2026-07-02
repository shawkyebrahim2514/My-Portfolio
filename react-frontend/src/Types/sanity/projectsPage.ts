import { CommonTitle } from "./common";
import { RichContentNode } from './richContent';

type Links = {
    demoLink: string;
    projectLink: string;
}

type Project = {
    links: Links;
    description: RichContentNode[];
    imgSrc: string;
    technologies: string[];
}

export type SanityProjectsPage = CommonTitle & {
    projects: Project[];
}