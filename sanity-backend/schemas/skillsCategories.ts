import { TbFolderCode } from "react-icons/tb";

export const skillsCategories = {
    name: 'skillsCategories',
    type: 'document',
    title: 'Skills Categories',
    icon: TbFolderCode,
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Name',
            validation: Rule => Rule.required()
        },
    ]
}