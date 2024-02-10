import { TbWorldCode } from "react-icons/tb";
import {
    aboutPage,
    skillsPage,
    educationPage,
    experiencePage,
    projectsPage,
    contactsPage
} from "./portfolio-pages";
import { portfolioPagesRestrition } from "./utilities";

export const portfolio = {
    name: 'portfolio',
    type: 'document',
    title: 'Portfolio',
    icon: TbWorldCode,
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Portfolio Title',
            validation: Rule => Rule.required()
        },
        {
            name: "pages",
            type: "array",
            title: "Pages",
            validation: Rule => Rule.custom(portfolioPagesRestrition),
            of: [
                aboutPage,
                skillsPage,
                educationPage,
                experiencePage,
                projectsPage,
                contactsPage
            ]
        }
    ]
}