import { IoCodeSlash } from "react-icons/io5";
import { ImportableImageInput } from "../../components/ImportableImageInput";

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
            title: 'Icon',
            components: { input: ImportableImageInput },
            fields: [{ name: 'sourceUrl', type: 'url', hidden: true }]
        },
    ]
}