import { TbWorldCode } from "react-icons/tb";
import { aboutPage } from "./about";
import { skillsPage } from "./skills";
import { educationPage } from "./education";
import { experiencePage } from "./experience";
import { projectsPage } from "./projects";
import { contactsPage } from "./contacts";
import { portfolioPagesRestrition } from "./utilities";

export const portfolio = {
    name: 'portfolio',
    type: 'document',
    title: 'Portfolio',
    icon: TbWorldCode,
    preview: {
        select: {
            title: 'navbar.logo'
        }
    },
    fields: [
        {
            name: 'navbar',
            type: 'object',
            title: 'Navbar',
            fields: [
                {
                    name: 'logo',
                    type: 'string',
                    title: 'Logo',
                    validation: Rule => Rule.required()
                },
            ]
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