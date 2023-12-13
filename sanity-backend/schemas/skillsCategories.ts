export const skillsCategories = {
    name: 'skillsCategories',
    type: 'document',
    title: 'Skills Categories',
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Name',
            validation: Rule => Rule.required()
        },
    ]
}