import {BsBookmarkCheck} from 'react-icons/bs'

export const hubLibrarySave = {
  name: 'hubLibrarySave',
  type: 'document',
  title: 'Library save',
  icon: BsBookmarkCheck,
  description: 'A public bookmark on /hub/library. Needs a note before it is worth publishing.',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required().max(160),
    },
    {
      name: 'url',
      type: 'url',
      title: 'URL',
      validation: (Rule) =>
        Rule.required()
          .uri({scheme: ['http', 'https']})
          .custom(async (url, context) => {
            if (!url) return true
            const id = context.document?._id?.replace(/^drafts\./, '')
            if (!id || typeof context.getClient !== 'function') return true
            const client = context.getClient({apiVersion: '2023-01-01'})
            const count = await client.fetch(
              `count(*[_type == "hubLibrarySave" && url == $url && !(_id in [$id, $draft])])`,
              {url, id, draft: `drafts.${id}`},
            )
            return count === 0 ? true : 'This URL is already in the library'
          }),
    },
    {
      name: 'note',
      type: 'text',
      title: 'Why I keep this',
      rows: 3,
      description: 'Required. One or two lines of taste — not a paste of the page title.',
      validation: (Rule) => Rule.required().max(320),
    },
    {
      name: 'collection',
      type: 'reference',
      title: 'Collection',
      to: [{type: 'hubLibraryCollection'}],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'language',
      type: 'string',
      title: 'Language',
      options: {
        list: [
          {title: 'English (LTR)', value: 'en'},
          {title: 'Arabic (RTL)', value: 'ar'},
        ],
        layout: 'radio',
      },
      initialValue: 'en',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags (optional)',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    },
    {
      name: 'featured',
      type: 'boolean',
      title: 'Feature this save',
      description: 'Shows a Featured badge and sorts it first in its collection.',
      initialValue: false,
    },
    {
      name: 'hiddenInProduction',
      type: 'boolean',
      title: 'Hide from production (preview-only)',
      description:
        'When ON, this save appears only in local dev and ?preview=1, not on the public library.',
      initialValue: false,
    },
  ],
  orderings: [
    {title: 'Title', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
      collection: 'collection.title',
      featured: 'featured',
      hidden: 'hiddenInProduction',
    },
    prepare: ({title, subtitle, collection, featured, hidden}) => ({
      title: hidden ? `🔒 ${title}` : title,
      subtitle: [collection, featured ? '★ Featured' : null, subtitle].filter(Boolean).join(' · '),
    }),
  },
}
