export const collegeCourses = {
    name: 'collegeCourses',
    type: 'document',
    title: 'College Courses',
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Name',
            validation: Rule => Rule.required()
        },
        {
            name: 'rank',
            type: 'number',
            title: 'Rank',
            initialValue: 0,
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
            of: [{ type: 'reference', to: [{ type: 'skills' }] }],
            validation: Rule => Rule.required()
        }
    ]
}