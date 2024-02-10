import { commanPageName } from "./commanFields";
import { FaCircleInfo } from "react-icons/fa6";

export const aboutPage = {
    name: 'aboutPage',
    type: 'document',
    title: 'About Page',
    icon: FaCircleInfo,
    fields: [
        commanPageName,
        {
            name: 'personImage',
            title: 'Person Image',
            type: 'url',
            validation: Rule => Rule.uri({
                scheme: ['http', 'https']
            }).required()
        },
        {
            name: 'salutation',
            type: 'string',
            title: 'Salutation',
            validation: Rule => Rule.required()
        },
        {
            name: 'personName',
            type: 'string',
            title: 'Person Name',
            validation: Rule => Rule.required()
        },
        {
            name: 'seeking',
            type: 'string',
            title: 'Seeking',
            validation: Rule => Rule.required()
        },
        {
            name: 'position',
            type: 'string',
            title: 'Position',
            validation: Rule => Rule.required()
        },
        {
            name: 'description',
            type: 'text',
            title: 'Description',
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
        }
    ]
}