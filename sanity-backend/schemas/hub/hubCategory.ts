import { BiCategory } from 'react-icons/bi'
import { makeIsUniqueSlug } from './utilities'

// Taxonomy for Hub entries (e.g. "Software Engineering", "Faith & Reflection",
// "Humanity & Life"). Kept as its own unit document (rather than a fixed
// enum) so new categories can be added from the Studio without a code
// deploy — this feature is meant to grow organically over time.
export const hubCategory = {
    name: 'hubCategory',
    type: 'document',
    title: 'Hub Category',
    icon: BiCategory,
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Title',
            validation: Rule => Rule.required(),
        },
        {
            name: 'slug',
            type: 'slug',
            title: 'Slug',
            description: 'Used in the category URL: /hub/category/<slug>.',
            options: {
                source: 'title',
                maxLength: 96,
                isUnique: makeIsUniqueSlug('hubCategory'),
            },
            validation: Rule => Rule.required(),
        },
        {
            name: 'description',
            type: 'text',
            title: 'Description',
            description: "Short blurb shown at the top of this category's listing page.",
            rows: 2,
        },
        {
            name: 'accentColor',
            type: 'string',
            title: 'Accent Color',
            options: { list: ['base', 'secondary'] },
            initialValue: 'secondary',
        },
        {
            name: 'icon',
            type: 'image',
            title: 'Icon',
        },
        {
            name: 'order',
            type: 'number',
            title: 'Display Order',
            description: 'Lower numbers appear first in category navigation. Leave empty to sort alphabetically.',
        },
    ],
    preview: {
        select: { title: 'title', subtitle: 'slug.current', media: 'icon' },
    },
}
