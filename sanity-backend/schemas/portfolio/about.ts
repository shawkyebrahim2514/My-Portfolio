import { changeDocumentPreviewTitle } from "./commanFields";
import { FaCircleInfo } from "react-icons/fa6";
import { richContentOf } from "../objects/richContent";
import { ImportableImageInput } from "../../components/ImportableImageInput";

export const aboutPage = {
    name: 'aboutPage',
    type: 'document',
    title: 'About Page',
    icon: FaCircleInfo,
    ...changeDocumentPreviewTitle("About Page"),
    fields: [
        {
            name: 'personImageAsset',
            title: 'Person image',
            type: 'image',
            description: 'Upload an image or paste a URL to import it permanently into Sanity.',
            components: { input: ImportableImageInput },
            fields: [{ name: 'sourceUrl', type: 'url', hidden: true }],
            validation: Rule => Rule.required()
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
            name: 'featuredFollows',
            type: 'array',
            title: 'Featured Follows',
            description:
                'Hand-picked Follows shown in the "Worth Following" teaser on this page. Add as many as you like, in the order you want them displayed.',
            of: [
                {
                    type: 'reference',
                    name: 'featuredFollow',
                    to: [{type: 'hubFollow'}],
                },
            ],
            validation: (Rule) => Rule.unique(),
        },
        {
            name: 'featuredInAbout',
            type: 'array',
            title: 'Featured Hub Entries',
            description: 'Hand-picked Hub entries shown in the "Things Worth Sharing" teaser on this page. Add as many as you like, in the order you want them displayed.',
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