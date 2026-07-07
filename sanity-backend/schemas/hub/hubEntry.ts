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
    { title: 'Video', value: 'video' },
    { title: 'Podcast', value: 'podcast' },
    { title: 'Read (article read elsewhere)', value: 'read' },
    { title: 'Book', value: 'book' },
]

// Every kind except a native `article` points off-site to the original
// source, so those entries need a source name/link/thumbnail instead of (or
// alongside) a body.
const isExternalKind = (kind?: string) => Boolean(kind) && kind !== 'article'

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
                'Who/what this was originally published by, e.g. "Fireship — YouTube", "Lex Fridman Podcast".',
            hidden: ({ parent }) => !isExternalKind(parent?.kind),
            validation: Rule =>
                Rule.custom((value, context) => {
                    const parent = context.parent as { kind?: string }
                    if (isExternalKind(parent?.kind) && !value) return 'Required for non-article entries'
                    return true
                }),
        },
        {
            name: 'sourceThumbnail',
            type: 'url',
            title: 'Source Thumbnail URL',
            description:
                'Fallback image URL when no Cover Image is uploaded, e.g. https://img.youtube.com/vi/<id>/hqdefault.jpg.',
            hidden: ({ parent }) => !isExternalKind(parent?.kind),
            validation: Rule => Rule.uri({ scheme: ['http', 'https'] }),
        },
        {
            name: 'externalUrl',
            type: 'url',
            title: 'External URL',
            description: 'Link to the original content (video, podcast episode, article, book page, etc.).',
            hidden: ({ parent }) => !isExternalKind(parent?.kind),
            validation: Rule =>
                Rule.uri({ scheme: ['http', 'https'] }).custom((value, context) => {
                    const parent = context.parent as { kind?: string }
                    if (isExternalKind(parent?.kind) && !value) return 'Required for non-article entries'
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
                Rule.custom((value, context) => {
                    const parent = context.parent as { kind?: string }
                    if (parent?.kind === 'article' && (!value || value.length === 0)) {
                        return 'Body is required for articles'
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
    ],
    orderings: [
        {
            title: 'Published, New to Old',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
    preview: {
        select: { title: 'title', kind: 'kind', media: 'coverImage' },
        prepare: ({ title, kind, media }) => ({
            title,
            subtitle: kind,
            media,
        }),
    },
}
