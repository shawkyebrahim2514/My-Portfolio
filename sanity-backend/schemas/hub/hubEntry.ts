import { BsShare } from 'react-icons/bs'
import { richContentOf } from '../objects/richContent'
import { makeIsUniqueSlug } from './utilities'
import {ChannelInput} from '../../components/ChannelInput'

// The single document shell behind the Hub. Taxonomy and publishing fields
// stay shared, while kinds with distinct semantics keep their own nested
// object instead of scattering conditional fields across the document.
const KIND_OPTIONS = [
    { title: 'Article (written on the Hub)', value: 'article' },
    { title: 'Channel (a channel you follow + its videos)', value: 'channel' },
    { title: 'Podcast', value: 'podcast' },
    { title: 'Reading List (articles read elsewhere)', value: 'read' },
    { title: 'Listening List (clips worth returning to)', value: 'listen' },
]

const isChannel = (kind?: string) => kind === 'channel'

export const hubEntry = {
    name: 'hubEntry',
    type: 'document',
    title: 'Hub Entry',
    icon: BsShare,
    groups: [
        {name: 'content', title: 'Content', default: true},
        {name: 'organization', title: 'Organization'},
        {name: 'publishing', title: 'Publishing'},
    ],
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Title',
            group: 'content',
            validation: Rule => Rule.required(),
        },
        {
            name: 'slug',
            type: 'slug',
            title: 'Slug',
            group: 'content',
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
            group: 'content',
            options: { list: KIND_OPTIONS, layout: 'radio' },
            initialValue: 'article',
            validation: Rule => Rule.required(),
        },
        {
            name: 'accent',
            type: 'color',
            title: 'Accent Color',
            group: 'organization',
            description:
                'Optional. A single base color for THIS entry — the whole page (navbar, headings, badges, progress ring, ambient effects) is themed from it. A full light-to-dark palette is generated from this one color. Leave empty to use the default color for the entry kind (e.g. violet for podcasts, red for channels).',
            options: { disableAlpha: true },
        },
        {
            name: 'language',
            type: 'string',
            title: 'Content Language',
            group: 'organization',
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
            group: 'organization',
            of: [{ type: 'reference', to: [{ type: 'hubCategory' }] }],
            validation: Rule => Rule.min(1).unique().required(),
        },
        {
            name: 'tags',
            type: 'array',
            title: 'Tags',
            group: 'organization',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
        },
        {
            name: 'excerpt',
            type: 'text',
            title: 'Excerpt',
            group: 'content',
            description:
                'Your short editorial summary shown on cards and used as the meta description. For Channels, explain why you recommend following it rather than copying the official channel bio.',
            rows: 3,
            validation: Rule => Rule.required().max(220),
        },
        {
            name: 'coverImage',
            type: 'url',
            title: 'Cover image URL',
            group: 'content',
            description:
                'Optional remote cover shown on Hub cards and the entry page. Listening lists use the first clip thumbnail when this is empty.',
            hidden: ({parent}) => isChannel(parent?.kind),
            validation: Rule => Rule.uri({scheme: ['http', 'https']}),
        },
        {
            name: 'coverFocus',
            type: 'remoteImageCrop',
            title: 'Cover crop',
            group: 'content',
            hidden: ({parent}) => isChannel(parent?.kind) || !parent?.coverImage,
            options: {
                imageField: 'coverImage',
                previewAspect: '16 / 9',
                defaultPreset: 'center',
            },
        },
        {
            name: 'channel',
            type: 'object',
            title: 'Channel',
            group: 'content',
            description: 'Channel identity, destination, artwork, and rich authored content.',
            hidden: ({parent}) => !isChannel(parent?.kind),
            components: {input: ChannelInput},
            validation: Rule =>
                Rule.custom((value, context) => {
                    const document = context.document as {kind?: string}
                    if (isChannel(document?.kind) && !value) {
                        return 'Channel details are required for channel entries'
                    }
                    return true
                }),
            fields: [
                {
                    name: 'platform',
                    title: 'Platform',
                    type: 'string',
                    options: {
                        list: [
                            {title: 'YouTube', value: 'youtube'},
                            {title: 'GitHub', value: 'github'},
                            {title: 'LinkedIn', value: 'linkedin'},
                            {title: 'Facebook', value: 'facebook'},
                            {title: 'Podcasts', value: 'podcast'},
                            {title: 'Website', value: 'website'},
                            {title: 'Twitter (X)', value: 'twitter'},
                        ],
                        layout: 'radio',
                    },
                    initialValue: 'youtube',
                    validation: Rule => Rule.required(),
                },
                {
                    name: 'url',
                    title: 'Channel URL',
                    type: 'url',
                    description: 'Canonical public URL visitors should open.',
                    validation: Rule => Rule.required().uri({scheme: ['http', 'https']}),
                },
                {
                    name: 'name',
                    title: 'Official Channel Name',
                    type: 'string',
                    description:
                        'The provider-facing channel name. You can keep the Hub entry title more editorial if needed.',
                    validation: Rule => Rule.required(),
                },
                {
                    name: 'channelId',
                    title: 'Platform Channel ID (optional)',
                    type: 'string',
                    description:
                        'Stable provider identifier, such as a YouTube UC… channel ID. Useful when a handle changes.',
                },
                {
                    name: 'handle',
                    title: 'Handle (optional)',
                    type: 'string',
                    description: 'Public handle shown in the header, e.g. @fireship.',
                    validation: Rule =>
                        Rule.custom((value: string | undefined) =>
                            !value || value.startsWith('@') ? true : 'Start the handle with @'
                        ),
                },
                {
                    name: 'avatar',
                    title: 'Channel Avatar URL',
                    type: 'url',
                    description: 'Remote provider image URL. YouTube metadata refresh fills this automatically.',
                    validation: Rule => Rule.uri({scheme: ['http', 'https']}),
                },
                {
                    name: 'body',
                    title: 'Channel Body',
                    type: 'array',
                    description:
                        'A rich, ordered canvas for your introduction, Curated Videos, expandable notes, takeaways, quotes, links, figures, code, and other supporting content.',
                    of: richContentOf,
                    validation: Rule =>
                        Rule.custom((value: {_type?: string; featured?: boolean}[] | undefined) => {
                            if (!value) return true
                            if (value.some(block => block?._type === 'youtube')) {
                                return 'Move ordinary YouTube videos to the More Videos field below'
                            }
                            const curatedVideos = value.filter(block => block?._type === 'curatedVideo')
                            if (curatedVideos.filter(video => video.featured).length > 1) {
                                return 'Only one Curated Video can be featured'
                            }
                            return true
                        }),
                },
                {
                    name: 'moreVideos',
                    title: 'More Videos',
                    type: 'array',
                    description:
                        'Additional recommendations rendered together as one responsive grid at the end of the Channel page.',
                    of: [
                        {
                            name: 'channelVideo',
                            title: 'Video',
                            type: 'object',
                            fields: [
                                {
                                    name: 'url',
                                    title: 'YouTube URL',
                                    type: 'url',
                                    validation: Rule =>
                                        Rule.required()
                                            .uri({scheme: ['http', 'https']})
                                            .custom((value: string | undefined) =>
                                                !value || /(?:youtube\.com|youtu\.be)/.test(value)
                                                    ? true
                                                    : 'Must be a YouTube URL'
                                            ),
                                },
                                {
                                    name: 'caption',
                                    title: 'Why it is worth watching (optional)',
                                    type: 'text',
                                    rows: 2,
                                    validation: Rule => Rule.max(280),
                                },
                            ],
                            preview: {
                                select: {title: 'caption', subtitle: 'url'},
                                prepare: ({title, subtitle}) => ({
                                    title: title || 'YouTube Video',
                                    subtitle,
                                }),
                            },
                        },
                    ],
                    validation: Rule =>
                        Rule.unique().custom((value: {url?: string}[] | undefined) => {
                            const urls = (value ?? []).map(video => video.url).filter(Boolean)
                            return new Set(urls).size === urls.length
                                ? true
                                : 'Each video URL can only be added once'
                        }),
                },
            ],
        },
        {
            name: 'platforms',
            type: 'array',
            title: 'Listen On',
            group: 'content',
            description: 'Platform links shown as brand pills in the podcast header (Spotify, Apple, YouTube, etc.).',
            hidden: ({parent}) => parent?.kind !== 'podcast',
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
            name: 'durationLabel',
            type: 'string',
            title: 'Duration / Reading Time',
            group: 'content',
            description: 'Freeform label, e.g. "5 min read", "42 min episode", "12 clips".',
            hidden: ({parent}) => isChannel(parent?.kind),
        },
        {
            name: 'body',
            type: 'array',
            title: 'Body / Your Notes',
            group: 'content',
            description:
                'Full write-up for articles, podcasts, reading lists, and listening lists. Channels use the rich body inside Channel details.',
            of: richContentOf,
            hidden: ({parent}) => isChannel(parent?.kind),
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
                    if (parent?.kind === 'listen') {
                        const hasListeningItem =
                            Array.isArray(value) && value.some(block => block?._type === 'listeningItem')
                        if (!hasListeningItem) return 'Add at least one listening item to the body'
                    }
                    return true
                }),
        },
        {
            name: 'publishedAt',
            type: 'datetime',
            title: 'Published At',
            group: 'publishing',
            initialValue: () => new Date().toISOString(),
            validation: Rule => Rule.required(),
        },
        {
            name: 'featured',
            type: 'boolean',
            title: 'Featured on Hub index',
            group: 'publishing',
            initialValue: false,
        },
        {
            name: 'featuredInCategory',
            type: 'boolean',
            title: "Editor's pick within its category",
            group: 'publishing',
            description:
                'Highlights this entry as a pick on its detail page (shows an "Editor\'s pick" badge). Independent of the global Hub-index feature flag above.',
            initialValue: false,
        },
        {
            name: 'hiddenInProduction',
            type: 'boolean',
            title: 'Hide from production (preview-only)',
            group: 'publishing',
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
        select: {
            title: 'title',
            kind: 'kind',
            hidden: 'hiddenInProduction',
        },
        prepare: ({title, kind, hidden}) => ({
            title: hidden ? `🔒 ${title}` : title,
            subtitle: hidden ? `${kind} · hidden in production` : kind,
        }),
    },
}
