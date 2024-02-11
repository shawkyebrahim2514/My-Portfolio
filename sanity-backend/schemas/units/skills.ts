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
            name: 'icon',
            type: 'image',
            title: 'Icon'
        },
    ]
}