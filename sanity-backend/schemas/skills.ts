import { IoCodeSlash } from "react-icons/io5";

export const skills = {
    name: 'skills',
    type: 'document',
    title: 'Skills',
    icon: IoCodeSlash,
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Name'
        },
        {
            name: 'rank',
            type: 'number',
            title: 'Rank',
            initialValue: 0,
            validation: Rule => Rule.required()
        },
        {
            name: 'category',
            type: 'reference',
            title: 'Category',
            to: [{ type: 'skillsCategories' }],
            validation: Rule => Rule.required()
        },
        {
            name: 'icon',
            type: 'image',
            title: 'Icon'
        },
    ]
}