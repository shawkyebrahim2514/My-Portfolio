import { PiCertificate } from "react-icons/pi";

export const certificates = {
    name: 'certificates',
    type: 'document',
    title: 'Certificates',
    icon: PiCertificate,
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Title',
            validation: Rule => Rule.required()
        },
        {
            name: 'subTitle',
            type: 'string',
            title: 'Sub Title',
            validation: Rule => Rule.required()
        },
        {
            name: 'description',
            type: 'text',
            title: 'Description',
        },
        {
            name: 'rank',
            type: 'number',
            title: 'Rank',
            initialValue: 0,
            validation: Rule => Rule.required()
        },
        {
            name: 'date',
            type: 'date',
            title: 'Date',
            options: {
                dateFormat: 'MM-YYYY',
            },
            validation: Rule => Rule.required()
        },
        {
            name: 'link',
            type: 'url',
            title: 'Link',
            validation: Rule => Rule.uri({
                scheme: ['http', 'https']
            })
        },
    ]
}
