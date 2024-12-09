import { BsMicrosoft } from "react-icons/bs";

export const professionalExperience = {
    name: 'professionalExperience',
    type: 'document',
    title: 'Professional Experience',
    icon: BsMicrosoft,
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
            name: 'date',
            type: 'object',
            title: 'Date',
            fields: [
                {
                    name: 'from',
                    type: 'date',
                    title: 'From',
                    options: {
                        dateFormat: 'MM-YYYY',
                    },
                    validation: Rule => Rule.required()
                },
                {
                    name: 'to',
                    type: 'date',
                    title: 'To',
                    options: {
                        dateFormat: 'MM-YYYY',
                    }
                }
            ]
        },
        {
            name: 'link',
            type: 'url',
            title: 'Link',
            validation: Rule => Rule.uri({
                scheme: ['http', 'https']
            })
        },
        {
            name: 'description',
            type: 'text',
            title: 'Description',
            validation: Rule => Rule.required()
        },
        {
            name: 'technologies',
            type: 'array',
            title: 'Technologies',
            of: [{ type: 'reference', to: [{ type: 'skills' }] }],
            validation: Rule => Rule.required()
        }
    ]
}