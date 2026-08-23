import { BsCollectionPlay } from 'react-icons/bs'
import { commanTitle } from '../portfolio/commanFields'
import { richContentOf } from '../objects/richContent'

const DIRECTORY_PLATFORM_OPTIONS = [
  {title: 'YouTube', value: 'youtube'},
  {title: 'GitHub', value: 'github'},
  {title: 'LinkedIn', value: 'linkedin'},
  {title: 'Facebook', value: 'facebook'},
  {title: 'Podcasts', value: 'podcast'},
  {title: 'Website', value: 'website'},
  {title: 'Twitter (X)', value: 'twitter'},
]

const DIRECTORY_TYPE_OPTIONS = [
  {title: 'Subscriptions', value: 'subscription'},
  {title: 'Creators', value: 'creator'},
]

const SUBSCRIPTION_PLATFORMS = new Set(['youtube', 'podcast', 'website'])
const CREATOR_PLATFORMS = new Set(['github', 'linkedin', 'facebook', 'twitter', 'website'])

const DIRECTORY_LANGUAGE_OPTIONS = [
  {title: 'English (LTR)', value: 'en'},
  {title: 'Arabic (RTL)', value: 'ar'},
]

export const hubChannelsDirectoryPage = {
  name: 'hubChannelsDirectoryPage',
  type: 'document',
  title: 'Hub Channels Directory',
  icon: BsCollectionPlay,
  fields: [
    commanTitle,
    {
      name: 'intro',
      type: 'array',
      title: 'Intro',
      description: 'Intro copy shown at the top of /hub/follows.',
      of: richContentOf,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'channels',
      type: 'array',
      title: 'Directory Items',
      description:
        'Powers the public Follows page. Shared list for Subscriptions + Creators. Keep each item short; link a Deep Dive entry only when you want a dedicated Hub page.',
      of: [
        {
          name: 'subscribedChannel',
          type: 'object',
          title: 'Directory item',
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
              validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
            },
            {
              name: 'avatar',
              type: 'url',
              title: 'Avatar URL (optional)',
              description: 'Remote image URL for the channel avatar/logo.',
              validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
            },
            {
              name: 'coverImage',
              type: 'url',
              title: 'Cover image URL (optional)',
              description: 'Remote wide image URL shown above the channel details.',
              validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
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
              title: 'Show on About page',
              description:
                'Include this follow in the About-page "Worth Following" teaser. Order follows the directory list.',
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
          preview: {
            select: {
              title: 'name',
              subtitle: 'url',
              type: 'type',
              platform: 'platform',
              deepDive: 'deepDiveEntry.title',
              featured: 'featured',
              featuredInAbout: 'featuredInAbout',
              hidden: 'hiddenInProduction',
            },
            prepare: ({title, subtitle, type, platform, deepDive, featured, featuredInAbout, hidden}) => ({
              title: hidden ? `🔒 ${title}` : title,
              subtitle: [
                type,
                platform,
                featured ? '★ Featured' : null,
                featuredInAbout ? 'About' : null,
                deepDive ? `Deep Dive: ${deepDive}` : null,
                subtitle,
              ]
                .filter(Boolean)
                .join(' · '),
            }),
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!Array.isArray(value) || value.length === 0) return true
          const urls = value.map((item) => item?.url).filter(Boolean)
          return new Set(urls).size === urls.length ? true : 'Each channel URL can only appear once'
        }),
    },
  ],
  preview: {
    select: {channels: 'channels'},
    prepare: ({channels}) => {
      const count = Array.isArray(channels) ? channels.length : 0
      return {
        title: 'Hub Channels Directory',
        subtitle: `${count} directory item${count === 1 ? '' : 's'}`,
      }
    },
  },
}
