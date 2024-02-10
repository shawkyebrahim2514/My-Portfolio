import { commanTitle, commanPageName } from "./commanFields";
import { IoCodeSlash } from "react-icons/io5";

export const skillsPage = {
    name: 'skillsPage',
    type: 'document',
    title: 'Skills Page',
    icon: IoCodeSlash,
    fields: [
        commanPageName,
        commanTitle,
        {
            name: 'categories',
            type: 'array',
            title: 'Categories',
            of: [
                {
                    type: 'object',
                    name: 'category',
                    title: 'Category',
                    fields: [
                        {
                            name: 'title',
                            type: 'string',
                            title: 'Title',
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'skills',
                            type: 'array',
                            title: 'Skills',
                            validation: Rule => Rule.unique().required(),
                            of: [
                                {
                                    type: 'reference',
                                    title: 'Skill',
                                    name: 'skill',
                                    to: [
                                        {
                                            type: 'skills'
                                        }
                                    ],
                                    validation: Rule => Rule.required()
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}