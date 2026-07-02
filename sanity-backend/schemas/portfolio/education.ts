import { commanTitle, changeDocumentPreviewTitle } from "./commanFields";
import { PiStudentFill } from "react-icons/pi";
import { richContentOf } from "../objects/richContent";

export const educationPage = {
    name: 'educationPage',
    type: 'document',
    title: 'Education Page',
    icon: PiStudentFill,
    ...changeDocumentPreviewTitle("Education Page"),
    fields: [
        commanTitle,
        {
            name: 'education',
            type: 'object',
            title: 'Education',
            fields: [
                {
                    name: 'name',
                    type: 'string',
                    title: 'Name',
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
                    name: 'date',
                    type: 'object',
                    title: 'Date',
                    fields: [
                        {
                            name: 'start',
                            type: 'date',
                            title: 'Start Date',
                            options: {
                                dateFormat: 'MM-YYYY'
                            },
                            validation: Rule => Rule.required()
                        },
                        {
                            name: 'end',
                            type: 'date',
                            title: 'End Date',
                            options: {
                                dateFormat: 'MM-YYYY'
                            },
                            validation: Rule => Rule.required()
                        }
                    ]
                },
                {
                    name: 'location',
                    type: 'string',
                    title: 'Location',
                    validation: Rule => Rule.required()
                },
                {
                    name: 'courses',
                    type: 'array',
                    title: 'Courses',
                    validation: Rule => Rule.unique().required(),
                    of: [
                        {
                            type: 'reference',
                            name: 'course',
                            to: [
                                {
                                    type: 'collegeCourses'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}