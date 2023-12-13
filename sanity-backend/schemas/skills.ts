export const skills = {
    name: 'skills',
    type: 'document',
    title: 'Skills',
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Name'
        },
        {
            name: 'rank',
            type: 'number',
            title: 'Rank',
            initialValue: 0,
            validation: Rule => Rule.required()
        },
        {
            name: 'category',
            type: 'reference',
            title: 'Category',
            to: [{ type: 'skillsCategories' }],
            validation: Rule => Rule.required()
        },
        {
            name: 'icon',
            type: 'image',
            title: 'Icon'
        },
    ]
}