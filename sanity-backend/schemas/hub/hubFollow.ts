import {BsPersonVideo} from 'react-icons/bs'

export const DIRECTORY_PLATFORM_OPTIONS = [
  {title: 'YouTube', value: 'youtube'},
  {title: 'GitHub', value: 'github'},
  {title: 'LinkedIn', value: 'linkedin'},
  {title: 'Facebook', value: 'facebook'},
  {title: 'Podcasts', value: 'podcast'},
  {title: 'Website', value: 'website'},
  {title: 'Twitter (X)', value: 'twitter'},
]

export const DIRECTORY_TYPE_OPTIONS = [
  {title: 'Subscriptions', value: 'subscription'},
  {title: 'Creators', value: 'creator'},
]

export const SUBSCRIPTION_PLATFORMS = new Set(['youtube', 'podcast', 'website'])
export const CREATOR_PLATFORMS = new Set(['github', 'linkedin', 'facebook', 'twitter', 'website'])

export const DIRECTORY_LANGUAGE_OPTIONS = [
  {title: 'English (LTR)', value: 'en'},
  {title: 'Arabic (RTL)', value: 'ar'},
]

export const hubFollow = {
  name: 'hubFollow',
  type: 'document',
  title: 'Follow',
  icon: BsPersonVideo,
  fields: [
    {
      name: 'type',
      type: 'string',
      title: 'Directory Type',
      options: {list: DIRECTORY_TYPE_OPTIONS, layout: 'radio'},
      initialValue: 'subscription',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule) => Rule.required().max(120),
    },
    {
      name: 'platform',
      type: 'string',
      title: 'Platform',
      options: {list: DIRECTORY_PLATFORM_OPTIONS, layout: 'radio'},
      initialValue: 'youtube',
      validation: (Rule) =>
        Rule.required().custom((platform, context) => {
          const parent = context.parent as {type?: string}
          if (!platform || !parent?.type) return true
          if (parent.type === 'subscription' && !SUBSCRIPTION_PLATFORMS.has(platform)) {
            return 'For Subscriptions, use: YouTube, Podcasts, or Website'
          }
          if (parent.type === 'creator' && !CREATOR_PLATFORMS.has(platform)) {
            return 'For Creators, use: GitHub, LinkedIn, Facebook, Twitter (X), or Website'
          }
          return true
        }),
    },
    {
      name: 'url',
      type: 'url',
      title: 'Profile / channel URL',
      validation: (Rule) =>
        Rule.required()
          .uri({scheme: ['http', 'https']})
          .custom(async (url, context) => {
            if (!url) return true
            const id = context.document?._id?.replace(/^drafts\./, '')
            if (!id || typeof context.getClient !== 'function') return true
            const client = context.getClient({apiVersion: '2023-01-01'})
            const count = await client.fetch(
              `count(*[_type == "hubFollow" && url == $url && !(_id in [$id, $draft])])`,
              {url, id, draft: `drafts.${id}`},
            )
            return count === 0 ? true : 'This URL is already used by another Follow'
          }),
    },
    {
      name: 'avatar',
      type: 'url',
      title: 'Avatar URL (optional)',
      description: 'Remote image URL for the channel avatar/logo.',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    },
    {
      name: 'avatarFocus',
      type: 'remoteImageCrop',
      title: 'Avatar crop',
      hidden: ({parent}) => !parent?.avatar,
      options: {
        imageField: 'avatar',
        previewAspect: '1 / 1',
        previewRadius: '50%',
        defaultPreset: 'center',
      },
    },
    {
      name: 'coverImage',
      type: 'url',
      title: 'Cover image URL (optional)',
      description: 'Remote wide image URL shown above the channel details.',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    },
    {
      name: 'coverFocus',
      type: 'remoteImageCrop',
      title: 'Cover crop',
      hidden: ({parent}) => !parent?.coverImage,
      options: {
        imageField: 'coverImage',
        previewAspect: '3 / 1',
        defaultPreset: 'top',
      },
    },
    {
      name: 'accent',
      type: 'color',
      title: 'Card accent color (optional)',
      description:
        'Optional per-card accent used for the platform badge, border, and call-to-action.',
      options: {disableAlpha: true},
    },
    {
      name: 'note',
      type: 'text',
      title: 'Quick note',
      rows: 3,
      description: 'Why you follow it, what you learned, or why it is valuable.',
      validation: (Rule) => Rule.required().max(320),
    },
    {
      name: 'language',
      type: 'string',
      title: 'Language',
      options: {list: DIRECTORY_LANGUAGE_OPTIONS, layout: 'radio'},
      initialValue: 'en',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'categories',
      type: 'array',
      title: 'Categories (optional)',
      of: [{type: 'reference', to: [{type: 'hubCategory'}]}],
      validation: (Rule) => Rule.unique(),
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags (optional)',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    },
    {
      name: 'deepDiveEntry',
      type: 'reference',
      title: 'Deep Dive Hub entry (optional)',
      description: 'If set, the directory card opens this Hub channel entry instead of the external URL.',
      to: [{type: 'hubEntry'}],
      options: {filter: 'kind == "channel"'},
    },
    {
      name: 'featured',
      type: 'boolean',
      title: 'Feature this follow',
      description: 'Shows a Featured badge on the Follows card.',
      initialValue: false,
    },
    {
      name: 'featuredInAbout',
      type: 'boolean',
      title: 'Show on About page (legacy)',
      description:
        'Unused. Pick Worth Following items on the About page under Featured Follows.',
      hidden: true,
      initialValue: false,
    },
    {
      name: 'hiddenInProduction',
      type: 'boolean',
      title: 'Hide from production (preview-only)',
      description:
        'When ON, this channel appears only in local dev and ?preview=1, not on public production listings.',
      initialValue: false,
    },
  ],
  orderings: [
    {title: 'Name', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]},
    {title: 'Platform', name: 'platformAsc', by: [{field: 'platform', direction: 'asc'}]},
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'url',
      type: 'type',
      platform: 'platform',
      deepDive: 'deepDiveEntry.title',
      featured: 'featured',
      hidden: 'hiddenInProduction',
    },
    prepare: ({title, subtitle, type, platform, deepDive, featured, hidden}) => ({
      title: hidden ? `🔒 ${title}` : title,
      subtitle: [
        type,
        platform,
        featured ? '★ Featured' : null,
        deepDive ? `Deep Dive: ${deepDive}` : null,
        subtitle,
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
}
