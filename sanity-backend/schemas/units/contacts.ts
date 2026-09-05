import { MdContacts } from "react-icons/md";
import { ImportableImageInput } from "../../components/ImportableImageInput";

export const contacts = {
    name: 'contacts',
    type: 'document',
    title: 'Contacts',
    icon: MdContacts,
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Name',
            validation: Rule => Rule.required()
        },
        {
            name: 'link',
            type: 'url',
            title: 'Link',
            validation: Rule => Rule.uri({
                scheme: ['http', 'https', 'mailto', 'tel']
            }).required()
        },
        {
            name: 'icon',
            type: 'image',
            title: 'Icon',
            components: { input: ImportableImageInput },
            fields: [{ name: 'sourceUrl', type: 'url', hidden: true }],
            validation: Rule => Rule.required()
        },
    ]
}