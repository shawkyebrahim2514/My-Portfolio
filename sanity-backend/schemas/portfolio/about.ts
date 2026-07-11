import { changeDocumentPreviewTitle } from "./commanFields";
import { FaCircleInfo } from "react-icons/fa6";
import { richContentOf } from "../objects/richContent";

export const aboutPage = {
    name: 'aboutPage',
    type: 'document',
    title: 'About Page',
    icon: FaCircleInfo,
    ...changeDocumentPreviewTitle("About Page"),
    fields: [
        {
            name: 'personImage',
            title: 'Person Image',
            type: 'url',
            validation: Rule => Rule.uri({
                scheme: ['http', 'https']
            }).required()
        },
        {
            name: 'circularRingText',
            title: 'Circular Ring Text',
            description: 'Short text repeated around the rotating ring surrounding the avatar photo (e.g. "SHAWKY EBRAHIM • SOFTWARE ENGINEER • "). Include a trailing separator/space so the repeated loop reads smoothly.',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'description',
            type: 'array',
            title: 'Description',
            of: richContentOf,
            validation: Rule => Rule.required()
        },
        {
            name: 'resume',
            type: 'object',
            title: 'Resume',
            fields: [
                {
                    name: 'text',
                    type: 'string',
                    title: 'Resume Text',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'link',
                    type: 'url',
                    title: 'Resume Link',
                    validation: Rule => Rule.uri({
                        scheme: ['http', 'https']
                    }).required()
                },
            ],
            validation: Rule => Rule.required()
        },
        {
            name: 'featuredInAbout',
            type: 'array',
            title: 'Featured Hub Entries',
            description: 'Hand-picked Hub entries shown in the "See what I share" teaser on this page. Add as many as you like, in the order you want them displayed.',
            of: [
                {
                    type: 'reference',
                    name: 'featuredHubEntry',
                    to: [
                        {
                            type: 'hubEntry'
                        }
                    ]
                }
            ],
            validation: Rule => Rule.unique()
        }
    ]
}