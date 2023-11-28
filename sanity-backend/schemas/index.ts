const skillsCategories = {
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

const skills = {
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

const collegeCourses = {
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
            name: 'languages',
            type: 'array',
            title: 'Languages',
            of: [{ type: 'reference', to: [{ type: 'skills' }] }],
            validation: Rule => Rule.required()
        }
    ]
}

const internships = {
    name: 'internships',
    type: 'document',
    title: 'Internships',
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Title',
            validation: Rule => Rule.required()
        },
        {
            name: 'subTitle',
            type: 'string',
            title: 'Sub Title',
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
            name: 'date',
            type: 'object',
            title: 'Date',
            fields: [
                {
                    name: 'from',
                    type: 'date',
                    title: 'From',
                    options: {
                        dateFormat: 'MM-YYYY',
                    },
                    validation: Rule => Rule.required()
                },
                {
                    name: 'to',
                    type: 'date',
                    title: 'To',
                    options: {
                        dateFormat: 'MM-YYYY',
                    }
                }
            ]
        },
        {
            name: 'link',
            type: 'url',
            title: 'Link',
        },
        {
            name: 'description',
            type: 'text',
            title: 'Description',
            validation: Rule => Rule.required()
        },
        {
            name: 'languages',
            type: 'array',
            title: 'Languages',
            of: [{ type: 'reference', to: [{ type: 'skills' }] }],
            validation: Rule => Rule.required()
        }
    ]
}

const projects = {
    name: 'projects',
    type: 'document',
    title: 'Projects',
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
            name: 'links',
            type: 'object',
            title: 'Links',
            fields: [
                {
                    name: 'demoLink',
                    type: 'url',
                    title: 'Demo Link',
                },
                {
                    name: 'projectLink',
                    type: 'url',
                    title: 'Project Link',
                },
            ]
        },
        {
            name: 'description',
            type: 'text',
            title: 'Description',
            validation: Rule => Rule.required()
        },
        {
            name: 'image',
            type: 'image',
            title: 'Image'
        },
        {
            name: 'languages',
            type: 'array',
            title: 'Languages',
            of: [{ type: 'reference', to: [{ type: 'skills' }] }],
            validation: Rule => Rule.required()
        }
    ]
}

const contacts = {
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

export const schemaTypes = [
    skillsCategories,
    skills,
    collegeCourses,
    internships,
    projects,
    contacts
]
