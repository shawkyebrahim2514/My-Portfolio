import { BiGitRepoForked } from "react-icons/bi";
import { richContentOf } from "../objects/richContent";
import { ImportableImageInput } from "../../components/ImportableImageInput";

export const projects = {
    name: 'projects',
    type: 'document',
    title: 'Projects',
    icon: BiGitRepoForked,
    preview: {
        select: {title: 'name', media: 'image'},
    },
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
            type: 'array',
            title: 'Description',
            of: richContentOf,
            validation: Rule => Rule.required()
        },
        {
            name: 'image',
            type: 'image',
            title: 'Image',
            components: { input: ImportableImageInput },
            fields: [{ name: 'sourceUrl', type: 'url', hidden: true }]
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