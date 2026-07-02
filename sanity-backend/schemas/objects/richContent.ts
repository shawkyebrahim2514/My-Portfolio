// Shared rich-text ("Portable Text") schema used by every long-form
// description field (About, Education, Courses, Internships, Professional
// Experience, Projects). Defined once here so every consumer stays in sync
// and the custom marks/objects map 1:1 to the same React renderers.
//
// This replaces the old plain-text field that held a hand-rolled bracket DSL
// (`[[Text]]`, `[center]`, `**!text!**`, `> [!variation] ...`, custom image
// syntax) with real structured content authored via Studio's rich-text
// toolbar — see react-frontend's `components/PortableText` for the renderer.

import { FaGripLines, FaImages, FaMessage } from 'react-icons/fa6'
import { HiOutlineArrowsExpand } from 'react-icons/hi'

// Inline object placed inside a block's `children`, alongside plain text
// spans. Replaces the old inline `[gap]`/`[newline]` text markers.
export const spacer = {
    name: 'spacer',
    title: 'Spacer',
    type: 'object',
    icon: HiOutlineArrowsExpand,
    fields: [
        {
            name: 'kind',
            title: 'Kind',
            type: 'string',
            options: {
                list: [
                    { title: 'Gap (inline horizontal space)', value: 'gap' },
                    { title: 'Newline (line break)', value: 'newline' },
                ],
            },
            initialValue: 'gap',
            validation: Rule => Rule.required(),
        },
    ],
    preview: {
        select: { kind: 'kind' },
        prepare: ({ kind }) => ({ title: kind === 'newline' ? '↵ Newline' : '↔ Gap' }),
    },
}

// Block-level object. Replaces the old `---` horizontal-rule marker.
export const divider = {
    name: 'divider',
    title: 'Divider',
    type: 'object',
    icon: FaGripLines,
    fields: [
        // Object array members need at least one field; kept hidden since a
        // divider currently has no configurable options.
        { name: 'kind', type: 'string', initialValue: 'line', hidden: true },
    ],
    preview: {
        prepare: () => ({ title: '— Divider —' }),
    },
}

// Block-level object. Replaces the `![alt](url =WxH|align)` image DSL with
// an explicit, authorable list of images instead of relying on markdown
// image adjacency to infer a "row".
export const imageRow = {
    name: 'imageRow',
    title: 'Image Row',
    type: 'object',
    icon: FaImages,
    fields: [
        {
            name: 'images',
            title: 'Images',
            type: 'array',
            of: [
                {
                    type: 'image',
                    fields: [
                        { name: 'alt', title: 'Alt text', type: 'string', validation: Rule => Rule.required() },
                        { name: 'maxWidth', title: 'Max width (px)', type: 'number' },
                        { name: 'maxHeight', title: 'Max height (px)', type: 'number' },
                    ],
                },
            ],
            validation: Rule => Rule.min(1).required(),
        },
        {
            name: 'align',
            title: 'Row alignment',
            type: 'string',
            options: { list: ['left', 'center', 'right'] },
            initialValue: 'center',
        },
    ],
    preview: {
        select: { images: 'images', align: 'align' },
        prepare: ({ images, align }) => ({
            title: `Image row (${images?.length ?? 0}) — ${align ?? 'center'}`,
            media: images?.[0],
        }),
    },
}

// The shared `of` array for every rich-content field. One definition reused
// across about/education/collegeCourses/internships/professionalExperience/
// projects so the custom marks and block objects never drift out of sync.
// `callout` (below) nests this SAME array as its `body`'s `of`, because the
// old DSL allowed arbitrary block content inside a blockquote — including
// another (unmarked, "plain") nested blockquote with its own marks/spacers,
// e.g. `> [!popup]\n> > During my internship **!at Microsoft!** ... [newline]`.
// Sanity supports self-referencing `{ type: 'callout' }` entries like this
// (resolved by name against the top-level schema, not by object identity).
export const richContentOf = [
    {
        type: 'block',
        // Extra inline child type allowed within a block's children, next to
        // plain spans — replaces the old inline [gap]/[newline] text markers.
        of: [{ type: 'spacer' }],
        styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'H5', value: 'h5' },
            { title: 'H6', value: 'h6' },
        ],
        lists: [{ title: 'Bulleted', value: 'bullet' }],
        marks: {
            decorators: [
                { title: 'Bold', value: 'strong' },
                { title: 'Italic', value: 'em' },
                { title: 'Code', value: 'code' },
                { title: 'Highlight (secondary)', value: 'highlightSecondary' },
                { title: 'Highlight area (base)', value: 'highlightAreaBase' },
                { title: 'Highlight area (secondary)', value: 'highlightAreaSecondary' },
                { title: 'Button badge', value: 'buttonBadge' },
                // Sanity's native `block` type has a fixed shape and does not
                // support arbitrary custom `fields` (e.g. a block-level
                // `textAlign` property) — attempting that throws a schema
                // validation error. The old [center]/[left]/[right] markers
                // are block-wide in the DSL, but here they're modeled as
                // decorators applied to every span in the block; the renderer
                // reads the mark off the block's children to align the whole
                // block (see components/PortableText block serializer).
                { title: 'Align left', value: 'alignLeft' },
                { title: 'Align center', value: 'alignCenter' },
                { title: 'Align right', value: 'alignRight' },
            ],
            annotations: [
                {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [
                        // Plain `string`, not Sanity's `url` type: real content
                        // uses relative in-app routes too (e.g. `./contacts`),
                        // not just absolute http(s) URLs.
                        { name: 'href', type: 'string', title: 'URL', validation: Rule => Rule.required() },
                    ],
                },
                {
                    name: 'buttonLink',
                    type: 'object',
                    title: 'Button link',
                    fields: [
                        { name: 'href', type: 'string', title: 'URL', validation: Rule => Rule.required() },
                        {
                            name: 'icon',
                            title: 'Icon',
                            type: 'string',
                            // The old DSL always rendered an icon on button
                            // links — a generic link icon by default, or a
                            // document icon with the explicit `|doc` suffix
                            // (`[[Text|doc]](url)`). There is no "no icon" state.
                            options: { list: ['link', 'doc'] },
                            initialValue: 'link',
                        },
                    ],
                },
            ],
        },
    },
    { type: 'callout' },
    { type: 'imageRow' },
    { type: 'divider' },
]

// Block-level object with a nested Portable Text body. Replaces the
// `> [!variation] Title` blockquote/callout DSL. `style: 'plain'` (with no
// background) is what a bare, marker-less nested blockquote maps to.
//
// NOTE: the old `customBlockquote` plugin had a dormant "promote first line
// to an h5 title" path, but it only ever fired when the text right after
// `[!variation]` was a single lowercase word with no spaces — which never
// happens in real authored titles (they're normal sentences). It never
// actually fired in any real content, and even when it did, the renderer
// had no distinct "title" treatment — the promoted heading just became a
// normal h5 among the quote's body content. So there's no dedicated
// `title` field here; a "titled" callout is just a callout whose first
// body block happens to be a heading.
export const callout = {
    name: 'callout',
    title: 'Callout',
    type: 'object',
    icon: FaMessage,
    fields: [
        {
            name: 'style',
            title: 'Style',
            type: 'string',
            options: { list: ['highlight', 'popup', 'plain'] },
            initialValue: 'plain',
            validation: Rule => Rule.required(),
        },
        {
            name: 'color',
            title: 'Color',
            type: 'string',
            options: { list: ['base', 'secondary'] },
            initialValue: 'base',
        },
        {
            name: 'body',
            title: 'Body',
            type: 'array',
            of: richContentOf,
            validation: Rule => Rule.required(),
        },
    ],
    preview: {
        select: { style: 'style', color: 'color' },
        prepare: ({ style, color }) => ({ title: `Callout — ${style}`, subtitle: color }),
    },
}
