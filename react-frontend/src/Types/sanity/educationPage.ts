import { CommonTitle } from "./common";

type Course = {
    description: string;
    technologies: string[];
}

export type SanityEducationPage = CommonTitle & {
    education: {
        description: string;
        courses: Course[];
    }
}