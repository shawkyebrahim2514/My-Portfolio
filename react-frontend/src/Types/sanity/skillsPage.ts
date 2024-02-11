import { CommonTitle } from "./common";

type Skill = {
    name: string;
    iconURL: string;
}

type Category = {
    title: string;
    skills: Skill[];
}

export type SanitySkillsPage = CommonTitle & {
    categories: Category[];
}