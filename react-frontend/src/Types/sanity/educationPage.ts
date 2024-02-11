import { CommonTitle } from "./common";

type Date = {
    start: string;
    end: string;
}

type Course = {
    name: string;
    description: string;
    technologies: string[];
}

export type SanityEducationPage = CommonTitle & {
    education: {
        name: string;
        description: string;
        location: string;
        date: Date;
        courses: Course[];
    }
}