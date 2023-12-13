export const contacts = {
    name: 'contacts',
    type: 'document',
    title: 'Contacts',
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Name',
            validation: Rule => Rule.required()
        },
        {
            name: 'link',
            type: 'url',
            title: 'Link',
            validation: Rule => Rule.uri({
                scheme: ['http', 'https', 'mailto', 'tel']
            }).required()
        },
        {
            name: 'icon',
            type: 'image',
            title: 'Icon',
            validation: Rule => Rule.required()
        },
    ]
}