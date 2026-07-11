import { BsShare } from 'react-icons/bs'
import { richContentOf } from '../objects/richContent'
import { makeIsUniqueSlug } from './utilities'

// The single content type behind the whole Hub feature. Rather than a
// separate schema per content kind (article/video/podcast/read/book), one
// `hubEntry` document covers all of them via the `kind` discriminator, with
// kind-specific fields (source/external link/thumbnail) shown conditionally.
// This keeps the taxonomy, featured/publish flow, and querying uniform
// across every kind of thing being shared.
const KIND_OPTIONS = [
    { title: 'Article (written on the Hub)', value: 'article' },
    { title: 'Channel (a channel you follow + its videos)', value: 'channel' },
    { title: 'Podcast', value: 'podcast' },
    { title: 'Reading List (articles read elsewhere)', value: 'read' },
]

// Only a `channel` entry points at a single off-site source (the channel page)
// and so needs a source name + external link. Podcasts carry their own
// `platforms` links, reading lists keep their links inside body `readingItem`
// blocks, and articles are written natively — none of those want a single
// External URL / Source Name.
const isChannel = (kind?: string) => kind === 'channel'

export const hubEntry = {
    name: 'hubEntry',
    type: 'document',
    title: 'Hub Entry',
    icon: BsShare,
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
            description: 'Used in the entry URL: /hub/<slug>.',
            options: {
                source: 'title',
                maxLength: 96,
                isUnique: makeIsUniqueSlug('hubEntry'),
            },
            validation: Rule => Rule.required(),
        },
        {
            name: 'kind',
            type: 'string',
            title: 'Kind',
            options: { list: KIND_OPTIONS, layout: 'radio' },
            initialValue: 'article',
            validation: Rule => Rule.required(),
        },
        {
            name: 'accent',
            type: 'color',
            title: 'Accent Color',
            description:
                'Optional. A single base color for THIS entry — the whole page (navbar, headings, badges, progress ring, ambient effects) is themed from it. A full light-to-dark palette is generated from this one color. Leave empty to use the default color for the entry kind (e.g. violet for podcasts, red for channels).',
            options: { disableAlpha: true },
        },
        {
            name: 'language',
            type: 'string',
            title: 'Content Language',
            description:
                'Controls text direction and typography on the entry: English renders left-to-right, Arabic renders right-to-left (RTL) with an Arabic font.',
            options: {
                list: [
                    { title: 'English (LTR)', value: 'en' },
                    { title: 'Arabic (RTL)', value: 'ar' },
                ],
                layout: 'radio',
            },
            initialValue: 'en',
            validation: Rule => Rule.required(),
        },
        {
            name: 'categories',
            type: 'array',
            title: 'Categories',
            of: [{ type: 'reference', to: [{ type: 'hubCategory' }] }],
            validation: Rule => Rule.min(1).unique().required(),
        },
        {
            name: 'tags',
            type: 'array',
            title: 'Tags',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
        },
        {
            name: 'excerpt',
            type: 'text',
            title: 'Excerpt',
            description: 'Short summary shown on cards and used as the meta description.',
            rows: 3,
            validation: Rule => Rule.required().max(220),
        },
        {
            name: 'coverImage',
            type: 'image',
            title: 'Cover Image',
            description:
                'Optional — falls back to the Source Thumbnail (e.g. an auto-derived YouTube thumbnail) if left empty.',
            options: { hotspot: true },
        },
        {
            name: 'sourceName',
            type: 'string',
            title: 'Source Name',
            description:
                'Who/what this was originally published by, e.g. the platform for a Channel ("YouTube").',
            hidden: ({ parent }) => !isChannel(parent?.kind),
            validation: Rule =>
                Rule.custom((value, context) => {
                    const parent = context.parent as { kind?: string }
                    if (isChannel(parent?.kind) && !value) return 'Required for channel entries'
                    return true
                }),
        },
        {
            name: 'channelHandle',
            type: 'string',
            title: 'Channel Handle',
            description: 'Optional @handle shown in the channel header, e.g. "@fireship".',
            hidden: ({ parent }) => parent?.kind !== 'channel',
        },
        {
            name: 'platforms',
            type: 'array',
            title: 'Listen On',
            description: 'Platform links shown as brand pills in the podcast header (Spotify, Apple, YouTube, etc.).',
            hidden: ({ parent }) => parent?.kind !== 'podcast',
            validation: Rule =>
                Rule.custom((value: unknown[] | undefined, context) => {
                    const parent = context.parent as { kind?: string }
                    if (parent?.kind === 'podcast' && (!value || value.length === 0)) {
                        return 'Add at least one platform link for a podcast'
                    }
                    return true
                }),
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'platform',
                            title: 'Platform',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Spotify', value: 'spotify' },
                                    { title: 'Apple Podcasts', value: 'apple' },
                                    { title: 'YouTube', value: 'youtube' },
                                    { title: 'SoundCloud', value: 'soundcloud' },
                                    { title: 'Anghami', value: 'anghami' },
                                    { title: 'RSS Feed', value: 'rss' },
                                    { title: 'Website', value: 'website' },
                                ],
                            },
                            validation: Rule => Rule.required(),
                        },
                        {
                            name: 'url',
                            title: 'URL',
                            type: 'url',
                            validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] }),
                        },
                    ],
                    preview: {
                        select: { platform: 'platform', url: 'url' },
                        prepare: ({ platform, url }) => ({ title: platform, subtitle: url }),
                    },
                },
            ],
        },
        {
            name: 'sourceThumbnail',
            type: 'url',
            title: 'Source Thumbnail URL',
            description:
                'Fallback image URL when no Cover Image is uploaded, e.g. https://img.youtube.com/vi/<id>/hqdefault.jpg.',
            hidden: ({ parent }) => !isChannel(parent?.kind),
            validation: Rule => Rule.uri({ scheme: ['http', 'https'] }),
        },
        {
            name: 'externalUrl',
            type: 'url',
            title: 'External URL',
            description: 'Link to the channel page.',
            hidden: ({ parent }) => !isChannel(parent?.kind),
            validation: Rule =>
                Rule.uri({ scheme: ['http', 'https'] }).custom((value, context) => {
                    const parent = context.parent as { kind?: string }
                    if (isChannel(parent?.kind) && !value) return 'Required for channel entries'
                    return true
                }),
        },
        {
            name: 'durationLabel',
            type: 'string',
            title: 'Duration / Reading Time',
            description: 'Freeform label, e.g. "5 min read", "42 min episode", "3 hr audiobook".',
        },
        {
            name: 'body',
            type: 'array',
            title: 'Body / Your Notes',
            description:
                'Full write-up for native articles, or your personal notes/take when sharing external content.',
            of: richContentOf,
            validation: Rule =>
                Rule.custom((value: { _type?: string }[] | undefined, context) => {
                    const parent = context.parent as { kind?: string }
                    if (parent?.kind === 'article' && (!value || value.length === 0)) {
                        return 'Body is required for articles'
                    }
                    if (parent?.kind === 'read') {
                        const hasReadingItem = Array.isArray(value) && value.some(block => block?._type === 'readingItem')
                        if (!hasReadingItem) return 'Add at least one reading item to the body'
                    }
                    return true
                }),
        },
        {
            name: 'publishedAt',
            type: 'datetime',
            title: 'Published At',
            initialValue: () => new Date().toISOString(),
            validation: Rule => Rule.required(),
        },
        {
            name: 'featured',
            type: 'boolean',
            title: 'Featured on Hub index',
            initialValue: false,
        },
        {
            name: 'featuredInCategory',
            type: 'boolean',
            title: "Editor's pick within its category",
            description:
                'Highlights this entry as a pick on its detail page (shows an "Editor\'s pick" badge). Independent of the global Hub-index feature flag above.',
            initialValue: false,
        },
        {
            name: 'hiddenInProduction',
            type: 'boolean',
            title: 'Hide from production (preview-only)',
            description:
                'When ON, this entry is hidden from every listing on the live site (Hub index, categories, About teaser, recommendations). It stays fully visible in local development, and can be revealed on the live site by adding ?preview=1 to any URL. Use this to keep reference/dummy entries around without showing them to visitors.',
            initialValue: false,
        },
    ],
    orderings: [
        {
            title: 'Published, New to Old',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
    preview: {
        select: { title: 'title', kind: 'kind', media: 'coverImage', hidden: 'hiddenInProduction' },
        prepare: ({ title, kind, media, hidden }) => ({
            title: hidden ? `🔒 ${title}` : title,
            subtitle: hidden ? `${kind} · hidden in production` : kind,
            media,
        }),
    },
}
