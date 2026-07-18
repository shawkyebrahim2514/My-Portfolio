// Shared rich-text ("Portable Text") schema used by every long-form
// description field (About, Education, Courses, Internships, Professional
// Experience, Projects). Defined once here so every consumer stays in sync
// and the custom marks/objects map 1:1 to the same React renderers.
//
// This replaces the old plain-text field that held a hand-rolled bracket DSL
// (`[[Text]]`, `[center]`, `**!text!**`, `> [!variation] ...`, custom image
// syntax) with real structured content authored via Studio's rich-text
// toolbar — see react-frontend's `components/PortableText` for the renderer.

import {
  FaGripLines,
  FaImages,
  FaMessage,
  FaYoutube,
  FaMicrophoneLines,
  FaBookmark,
  FaLink,
  FaImage,
} from 'react-icons/fa6'
import {HiOutlineArrowsExpand} from 'react-icons/hi'
import {LinkPreviewInput} from '../../components/LinkPreviewInput'
import {ReadingItemInput} from '../../components/ReadingItemInput'

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
          {title: 'Gap (inline horizontal space)', value: 'gap'},
          {title: 'Newline (line break)', value: 'newline'},
        ],
      },
      initialValue: 'gap',
    },
  ],
  preview: {
    select: {kind: 'kind'},
    prepare: ({kind}) => ({title: kind === 'newline' ? '↵ Newline' : '↔ Gap'}),
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
    {name: 'kind', type: 'string', initialValue: 'line', hidden: true},
  ],
  preview: {
    prepare: () => ({title: '— Divider —'}),
  },
}

export const externalImage = {
  name: 'externalImage',
  title: 'External Image URL',
  type: 'object',
  icon: FaImage,
  fields: [
    {
      name: 'url',
      title: 'Image URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    },
    {name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required()},
    {name: 'caption', title: 'Caption (optional)', type: 'string'},
    {name: 'maxWidth', title: 'Max width (px)', type: 'number'},
    {name: 'maxHeight', title: 'Max height (px)', type: 'number'},
  ],
  preview: {
    select: {title: 'alt', subtitle: 'url'},
    prepare: ({title, subtitle}) => ({title: title || 'External image', subtitle}),
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
            {name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required()},
            {name: 'caption', title: 'Caption (optional)', type: 'string'},
            {name: 'maxWidth', title: 'Max width (px)', type: 'number'},
            {name: 'maxHeight', title: 'Max height (px)', type: 'number'},
          ],
        },
        {type: 'externalImage'},
      ],
      validation: (Rule) => Rule.min(1).required(),
    },
    {
      name: 'align',
      title: 'Row alignment',
      type: 'string',
      options: {list: ['left', 'center', 'right']},
      initialValue: 'center',
    },
    {name: 'caption', title: 'Overall caption (optional)', type: 'string'},
  ],
  preview: {
    select: {images: 'images', align: 'align'},
    prepare: ({images, align}) => ({
      title: `Image row (${images?.length ?? 0}) — ${align ?? 'center'}`,
      media: images?.[0],
    }),
  },
}

// One primary visual with a detailed caption and source credit. Use Image Row
// when several visuals are intended to be compared together.
export const figure = {
  name: 'figure',
  title: 'Figure',
  type: 'object',
  icon: FaImage,
  fields: [
    {
      name: 'sourceType',
      title: 'Image source',
      type: 'string',
      options: {
        list: [
          {title: 'Upload to Sanity', value: 'sanity'},
          {title: 'External image URL', value: 'external'},
        ],
        layout: 'radio',
      },
      initialValue: 'sanity',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      hidden: ({parent}) => parent?.sourceType === 'external',
      fields: [
        {name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required()},
      ],
      validation: (Rule) =>
        Rule.custom((value, context) =>
          context.parent?.sourceType === 'sanity' && !value ? 'Upload an image' : true,
        ),
    },
    {
      name: 'externalImage',
      title: 'External image',
      type: 'externalImage',
      hidden: ({parent}) => parent?.sourceType !== 'external',
      validation: (Rule) =>
        Rule.custom((value, context) =>
          context.parent?.sourceType === 'external' && !value ? 'Add an external image URL' : true,
        ),
    },
    {name: 'caption', title: 'Caption (optional)', type: 'text', rows: 2},
    {name: 'credit', title: 'Credit (optional)', type: 'string'},
    {
      name: 'creditUrl',
      title: 'Credit / source URL (optional)',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    },
  ],
  preview: {
    select: {caption: 'caption', image: 'image'},
    prepare: ({caption, image}) => ({title: caption || 'Figure', media: image}),
  },
}

// Block-level object: an embedded YouTube video. Authors just paste the
// video URL (any form — watch?v=, youtu.be/, /shorts/, /embed/, /live/); the
// frontend extracts the ID and renders a lightweight click-to-play player.
// No API key or enrichment step — the thumbnail (i.ytimg.com) and the
// youtube-nocookie player both work from the URL alone, so this authors
// identically from the local or the hosted Studio.
export const youtube = {
  name: 'youtube',
  title: 'YouTube Video',
  type: 'object',
  icon: FaYoutube,
  fields: [
    {
      name: 'url',
      title: 'YouTube URL',
      type: 'url',
      description:
        'Paste any YouTube link — watch?v=…, youtu.be/…, /shorts/…, /embed/…, or /live/…',
      validation: (Rule) =>
        Rule.required()
          .uri({scheme: ['http', 'https']})
          .custom((value) => {
            if (!value) return true
            return /(?:youtube\.com|youtu\.be)/.test(value) ? true : 'Must be a YouTube URL'
          }),
    },
    {
      name: 'caption',
      title: 'Caption (optional)',
      type: 'string',
      description: 'Shown beneath the player, e.g. "Talk: Rethinking React state".',
    },
    {
      name: 'featured',
      title: 'Pin as the featured video',
      type: 'boolean',
      description:
        'Renders this video large and full-width above the video grid. Only the first featured video is pinned.',
      initialValue: false,
    },
  ],
  preview: {
    select: {url: 'url', caption: 'caption', featured: 'featured'},
    prepare: ({url, caption, featured}) => ({
      title: caption || 'YouTube Video',
      subtitle: [featured ? '★ Featured' : null, url].filter(Boolean).join(' — '),
    }),
  },
}

// Block-level object: a single podcast episode, meant to be inserted
// (repeatedly) in a Podcast-kind entry's body — the audio analogue of the
// `youtube` block. The frontend derives the provider + embed from the URL:
// a Spotify or YouTube link becomes an inline click-to-play player (both are
// key-free and self-contained), any other link falls back to a "Listen"
// button that opens the episode in a new tab. Metadata (number/date/duration)
// is authored by hand so the card reads well before the player loads.
export const podcastEpisode = {
  name: 'podcastEpisode',
  title: 'Podcast Episode',
  type: 'object',
  icon: FaMicrophoneLines,
  fields: [
    {
      name: 'title',
      title: 'Episode Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'Episode URL',
      type: 'url',
      description:
        'Link to the episode. A Spotify or YouTube link plays inline; any other link opens in a new tab.',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    },
    {
      name: 'episodeLabel',
      title: 'Episode Label (optional)',
      type: 'string',
      description: 'Short number/label shown as a badge, e.g. "01" or "S2 · E5".',
    },
    {
      name: 'date',
      title: 'Published Date (optional)',
      type: 'date',
      options: {dateFormat: 'MMM YYYY'},
    },
    {
      name: 'duration',
      title: 'Duration (optional)',
      type: 'string',
      description: 'Freeform, e.g. "42 min".',
    },
    {
      name: 'note',
      title: 'Your Note (optional)',
      type: 'text',
      rows: 2,
      description: 'A short line on why this episode is worth a listen.',
    },
    {
      name: 'featured',
      title: 'Pin as the featured episode',
      type: 'boolean',
      description: 'Renders this episode as the large player pinned at the top of the page.',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: 'title',
      episodeLabel: 'episodeLabel',
      duration: 'duration',
      featured: 'featured',
    },
    prepare: ({title, episodeLabel, duration, featured}) => ({
      title: [episodeLabel, title].filter(Boolean).join(' · '),
      subtitle: [featured ? '★ Featured' : null, duration].filter(Boolean).join(' — ') || 'Episode',
    }),
  },
}

// Block-level object: a single article/link the author read elsewhere and is
// recommending. Inserted (repeatedly) in a Read-kind entry's body, turning
// that entry into a curated reading list. Renders as a compact row that links
// out to the original — no inline embed, no body of its own.
export const readingItem = {
  name: 'readingItem',
  title: 'Reading Item',
  type: 'object',
  icon: FaBookmark,
  components: {input: ReadingItemInput},
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    },
    {
      name: 'source',
      title: 'Source (optional)',
      type: 'string',
      description: 'Where it lives, e.g. "freeCodeCamp" or an author name.',
    },
    {
      name: 'author',
      title: 'Author (optional)',
      type: 'string',
      description: 'The person or organization behind the resource.',
    },
    {
      name: 'publishedAt',
      title: 'Published date (optional)',
      type: 'date',
      options: {dateFormat: 'MMM YYYY'},
    },
    {
      name: 'contentType',
      title: 'Resource type (optional)',
      type: 'string',
      options: {
        list: [
          {title: 'Article', value: 'article'},
          {title: 'Documentation', value: 'documentation'},
          {title: 'Paper', value: 'paper'},
          {title: 'Book', value: 'book'},
        ],
      },
    },
    {
      name: 'faviconUrl',
      title: 'Favicon URL',
      type: 'url',
      readOnly: true,
      description: 'Filled from link metadata; remove it to fall back to the source favicon.',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    },
    {
      name: 'note',
      title: 'Your Note (optional)',
      type: 'text',
      rows: 2,
      description: 'A short line on why it is worth reading.',
    },
    {
      name: 'featured',
      title: 'Pin as the featured read',
      type: 'boolean',
      description:
        'Highlights this article as the lead pick above the rest of the list. Only the first featured item is pinned.',
      initialValue: false,
    },
  ],
  preview: {
    select: {title: 'title', source: 'source', contentType: 'contentType', featured: 'featured'},
    prepare: ({title, source, contentType, featured}) => ({
      title,
      subtitle:
        [featured ? '★ Featured' : null, contentType, source].filter(Boolean).join(' — ') ||
        'Reading item',
    }),
  },
}

// A rich external-link card. Its object input resolves Open Graph metadata as
// soon as the author pastes a URL, but each value remains editable for sources
// that omit or misreport metadata.
export const linkPreview = {
  name: 'linkPreview',
  title: 'Link Preview',
  type: 'object',
  icon: FaLink,
  components: {input: LinkPreviewInput},
  fields: [
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    },
    {name: 'title', title: 'Title', type: 'string'},
    {name: 'description', title: 'Description', type: 'text', rows: 3},
    {
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    },
    {name: 'siteName', title: 'Publisher / Site name', type: 'string'},
    {
      name: 'faviconUrl',
      title: 'Favicon URL',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    },
  ],
  preview: {
    select: {title: 'title', siteName: 'siteName', url: 'url', media: 'imageUrl'},
    prepare: ({title, siteName, url}) => ({
      title: title || url || 'Link preview',
      subtitle: siteName || 'Fetching metadata after URL is pasted',
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
    // Preserve migrated spacer values, but do not offer manual spacer insertion
    // in new content. Normal paragraph spacing is the authoring default.
    of: [{type: 'spacer', hidden: true}],
    styles: [
      {title: 'Normal', value: 'normal'},
      {title: 'H1', value: 'h1'},
      {title: 'H2', value: 'h2'},
      {title: 'H3', value: 'h3'},
      {title: 'H4', value: 'h4'},
      {title: 'H5', value: 'h5'},
      {title: 'H6', value: 'h6'},
    ],
    lists: [
      {title: 'Bulleted', value: 'bullet'},
      {title: 'Numbered', value: 'number'},
    ],
    marks: {
      decorators: [
        {title: 'Bold', value: 'strong'},
        {title: 'Italic', value: 'em'},
        {title: 'Code', value: 'code'},
        {title: 'Highlight (secondary)', value: 'highlightSecondary'},
        {title: 'Highlight area (base)', value: 'highlightAreaBase'},
        {title: 'Highlight area (secondary)', value: 'highlightAreaSecondary'},
        {title: 'Button badge', value: 'buttonBadge'},
        // Sanity's native `block` type has a fixed shape and does not
        // support arbitrary custom `fields` (e.g. a block-level
        // `textAlign` property) — attempting that throws a schema
        // validation error. The old [center]/[left]/[right] markers
        // are block-wide in the DSL, but here they're modeled as
        // decorators applied to every span in the block; the renderer
        // reads the mark off the block's children to align the whole
        // block (see components/PortableText block serializer).
        {title: 'Align left', value: 'alignLeft'},
        {title: 'Align center', value: 'alignCenter'},
        {title: 'Align right', value: 'alignRight'},
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
            {name: 'href', type: 'string', title: 'URL', validation: (Rule) => Rule.required()},
          ],
        },
        {
          name: 'buttonLink',
          type: 'object',
          title: 'Button link',
          fields: [
            {name: 'href', type: 'string', title: 'URL', validation: (Rule) => Rule.required()},
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              // The old DSL always rendered an icon on button
              // links — a generic link icon by default, or a
              // document icon with the explicit `|doc` suffix
              // (`[[Text|doc]](url)`). There is no "no icon" state.
              options: {list: ['link', 'doc']},
              initialValue: 'link',
            },
          ],
        },
      ],
    },
  },
  {type: 'callout'},
  {type: 'note'},
  {type: 'imageRow'},
  {type: 'figure'},
  {type: 'divider'},
  {type: 'youtube'},
  {type: 'podcastEpisode'},
  {type: 'readingItem'},
  {type: 'linkPreview'},
  // Syntax-highlighted code block (from @sanity/code-input). Stores the raw
  // source, a language, an optional filename, and highlighted line numbers;
  // the frontend renders it with a pre-made Prism highlighter.
  {
    type: 'code',
    title: 'Code Block',
    options: {
      withFilename: true,
      languageAlternatives: [
        {title: 'Plain text', value: 'text'},
        {title: 'Bash / Shell', value: 'bash'},
        {title: 'JavaScript', value: 'javascript'},
        {title: 'TypeScript', value: 'typescript'},
        {title: 'JSX', value: 'jsx'},
        {title: 'TSX', value: 'tsx'},
        {title: 'JSON', value: 'json'},
        {title: 'HTML', value: 'markup'},
        {title: 'CSS', value: 'css'},
        {title: 'Python', value: 'python'},
        {title: 'Go', value: 'go'},
        {title: 'SQL', value: 'sql'},
        {title: 'Markdown', value: 'markdown'},
      ],
    },
  },
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
      options: {list: ['highlight', 'popup', 'plain']},
      initialValue: 'plain',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {list: ['base', 'secondary']},
      initialValue: 'base',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: richContentOf,
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {style: 'style', color: 'color'},
    prepare: ({style, color}) => ({title: `Callout — ${style}`, subtitle: color}),
  },
}

export const note = {
  name: 'note',
  title: 'Note',
  type: 'object',
  icon: FaMessage,
  fields: [
    {
      name: 'tone',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Note', value: 'note'},
          {title: 'Tip', value: 'tip'},
          {title: 'Important', value: 'important'},
          {title: 'Warning', value: 'warning'},
        ],
        layout: 'radio',
      },
      initialValue: 'note',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title (optional)',
      type: 'string',
      description: 'A short label that introduces the note.',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: richContentOf,
      validation: (Rule) => Rule.required(),
    },
  ],
  preview: {
    select: {title: 'title', tone: 'tone'},
    prepare: ({title, tone}) => ({title: title || tone || 'Note', subtitle: tone}),
  },
}
