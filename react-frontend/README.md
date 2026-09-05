# My Personal Portfolio

## Development

This project uses [Vike](https://vike.dev/) (Vite-native SSG) for routing,
per-page data-fetching, and build-time pre-rendering — each route under
[`pages/`](./pages) has its own `+Page.tsx` (UI), `+data.ts` (Sanity fetch,
runs at build time), and `+config.ts` (per-page `<title>`/`<description>`).
The shared app shell (theme, nav, skip-link) lives in
[`pages/+Layout.tsx`](./pages/+Layout.tsx); global `<head>` tags (favicon,
manifest, JSON-LD) live in [`pages/+Head.tsx`](./pages/+Head.tsx). The site
is fully pre-rendered at build time (`prerender: true`), so the production
build in `dist/client` is 100% static — no Node server required.

### Getting Started

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

Build for production:

```
npm run build
```

Preview the production build:

```
npm run preview
```

---

## Rich Content (Portable Text)

Long-form description fields (About, Education, Courses, Internships,
Professional Experience, Projects, Certificates) are authored directly in
[Sanity Studio](../sanity-backend)'s rich-text editor using
[Portable Text](https://www.portabletext.org/), Sanity's structured content
format. There is no markdown/DSL syntax to type by hand and no `/markdown`
preview route anymore — the Studio toolbar exposes every option below, and
the frontend renders it with `@portabletext/react` in
[`src/components/RichContent`](./src/components/RichContent).

> The older hand-rolled bracket-DSL (`[[Text]]`, `[center]`, `**!text!**`,
> `> [!variation] ...`, custom image syntax) documented in earlier versions
> of this README has been fully retired; all content was migrated to the
> structures below with matching visual output.

### Text styles (decorators)

Available from the Studio toolbar when text is selected:

- **Bold**, *Italic*, `Code` — standard marks.
- **Highlight (secondary)** — bold text in the secondary color.
- **Highlight area (base)** / **Highlight area (secondary)** — a colored
  background area behind the text, base or secondary color.
- **Button badge** — renders the text as a non-interactive button-styled
  badge (no link).
- **Align left / center / right** — applied to a whole block via a
  decorator on its text (the renderer aligns the entire block).

### Links

Selecting text and adding an annotation offers two link types:

- **Link** — a plain inline link, rendered with an icon next to the text.
- **Button link** — renders the text as a clickable button with a `link`
  or `doc` icon (choose the icon in the annotation's fields).

A link/button-link annotation combined with a highlight decorator on the
same text keeps the old app's visual behavior — e.g. a highlighted
section heading that's also a link still shows the highlight color, not
the plain link underline.

### Block objects

Insert these from the "+" menu within the editor, alongside normal
paragraphs/headings/bullet lists:

- **Callout** — a nested rich-text block with `style` (`highlight` /
  `popup` / `plain`) and `color` (`base` / `secondary`) fields; its `body`
  supports the same full rich-content toolset, including a nested callout.
- **Note** — a semantic Note, Tip, Important, or Warning with an optional
  title and rich-text body.
- **Image row** — one or more uploaded or external-URL images with alt text,
  optional captions/dimensions, and row-level alignment.
- **Figure** — one primary uploaded or external image with alt text,
  caption, and optional credited source.
- **Link preview** — resolves and stores title, description, publisher,
  thumbnail, and favicon metadata from a pasted URL.
- **Facebook Resource** — a reliable outbound card for a Facebook reel, video,
  post, photo, or article, with an editorial title, creator/page, commentary,
  optional uploaded or remote thumbnail, and an optional featured layout.
- **Reading item** — an enriched reading recommendation with metadata,
  author/date/type fields, and an optional note.
- **Key Takeaways** — a heading plus one to six concise checklist items.
- **Quote / Citation** — quotation text with optional speaker, context, and
  source URL.
- **Expandable Details** — a native disclosure with a summary, rich body,
  and optional initially-open state.
- **Curated Video** — a Channel-focused YouTube block that keeps rich
  companion content (notes, takeaways, quotes, links, figures, code, and
  expandable sections) attached directly beneath the video.
- **YouTube video** and **Podcast episode** — rich media embeds.
- **Divider** — a plain horizontal rule.

Legacy inline Spacer values remain renderable for migrated content, but Spacer
is hidden from new authoring. Use normal paragraphs and layout blocks instead.

Channel entries keep full-width Curated Videos in their rich body. Additional
ordinary recommendations belong in the dedicated **More Videos** array and
render together as one responsive grid at the end of the page.

The `/hub/follows` route is the Hub **Follows** page: a shared list of Subscriptions + Creators.
quick cards with directory/platform/category filters, search, optional cover
image + custom accent color, and an optional deep-dive link to a dedicated
Channel Hub entry.

### Metadata endpoint configuration

The Studio resolves pasted URLs through the Vercel functions at
`api/link-preview.ts` and `api/image-import.ts`. The image importer accepts
only authenticated Sanity editors and public raster-image URLs, then the
Studio uploads the downloaded bytes into Sanity Assets. Source URLs are stored
inside image values for later replacement, not rendered as remote fallbacks.
Local endpoint testing requires `npx vercel dev`; a normal `npm run dev` does
not serve the functions.

- Set the server-only Vercel variable `SANITY_STUDIO_ORIGIN` to the deployed
  Studio origin.
- Set the Studio build variable `SANITY_STUDIO_LINK_PREVIEW_ENDPOINT` to the
  canonical production `/api/link-preview` URL before deploying Studio.
- Set the server-only Vercel variable `YOUTUBE_DATA_API_KEY` to a Google Cloud
  key restricted to YouTube Data API v3. The Studio calls
  `/api/youtube-channel` to import a YouTube channel's official name, stable
  ID, handle, canonical URL, and remote avatar URL into the nested Channel
  fields.
- Set the Studio build variable `SANITY_STUDIO_YOUTUBE_CHANNEL_ENDPOINT` to
  the canonical production `/api/youtube-channel` URL before deploying Studio.
- Set the Studio build variable `SANITY_STUDIO_IMAGE_IMPORT_ENDPOINT` to the
  canonical production `/api/image-import` URL before deploying Studio.

For local Channel refreshes, run `npx vercel dev --listen 3002`; the local
Studio fallback calls `http://localhost:3002/api/youtube-channel`.

See both workspace `.env.example` files for the current values.

### Headings & lists

Standard block styles (`H1`–`H6`, `Normal`) plus bulleted and numbered lists
are available from the editor toolbar.

### Example

![Quick Intro About Me](./markdown-examples/quick%20intro.png)

![Shawky with Clarity Apps Team](./markdown-examples/microsoft%20internship%20experience.png)

![Shawky with Clarity Apps Team](./markdown-examples/microsoft%20clarity%20apps%20team.png)
