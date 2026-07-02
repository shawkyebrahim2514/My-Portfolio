import { CommonTitle } from "./common";
import { RichContentNode } from './richContent';

type Course = {
    description: RichContentNode[];
    technologies: string[];
}

export type SanityEducationPage = CommonTitle & {
    education: {
        description: RichContentNode[];
        courses: Course[];
    }
}