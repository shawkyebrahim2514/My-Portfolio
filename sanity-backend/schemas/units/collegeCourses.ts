import { PiStudentFill } from "react-icons/pi";

export const collegeCourses = {
    name: 'collegeCourses',
    type: 'document',
    title: 'College Courses',
    icon: PiStudentFill,
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Name',
            validation: Rule => Rule.required()
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
            of: [{ type: 'reference', to: [{ type: 'skills' }] }]
        }
    ]
}