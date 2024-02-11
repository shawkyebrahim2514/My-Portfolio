import { BiGitRepoForked } from "react-icons/bi";

export const projects = {
    name: 'projects',
    type: 'document',
    title: 'Projects',
    icon: BiGitRepoForked,
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Name',
            validation: Rule => Rule.required()
        },
        {
            name: 'links',
            type: 'object',
            title: 'Links',
            fields: [
                {
                    name: 'demoLink',
                    type: 'url',
                    title: 'Demo Link',
                    validation: Rule => Rule.uri({
                        scheme: ['http', 'https']
                    })
                },
                {
                    name: 'projectLink',
                    type: 'url',
                    title: 'Project Link',
                    validation: Rule => Rule.uri({
                        scheme: ['http', 'https']
                    })
                },
            ]
        },
        {
            name: 'description',
            type: 'text',
            title: 'Description',
            validation: Rule => Rule.required()
        },
        {
            name: 'image',
            type: 'image',
            title: 'Image'
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