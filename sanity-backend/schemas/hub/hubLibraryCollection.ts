import {BiBookmark} from 'react-icons/bi'
import {makeIsUniqueSlug} from './utilities'

export const hubLibraryCollection = {
  name: 'hubLibraryCollection',
  type: 'document',
  title: 'Library collection',
  icon: BiBookmark,
  description: 'Flat shelves on /hub/library (Career, Tools, Books). Not Hub post categories.',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required().max(80),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'Used in the collection URL: /hub/library/<slug>.',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: makeIsUniqueSlug('hubLibraryCollection'),
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
      description: 'Short blurb at the top of this collection page.',
      rows: 2,
      validation: (Rule) => Rule.max(240),
    },
    {
      name: 'order',
      type: 'number',
      title: 'Display order',
      description: 'Lower numbers appear first. Leave empty to sort by title.',
    },
  ],
  orderings: [
    {title: 'Display order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}, {field: 'title', direction: 'asc'}]},
    {title: 'Title', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
}
