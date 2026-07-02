# My Personal Portfolio

## Development

This project now uses [Vite](https://vitejs.dev/) for development and build.

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
- **Image row** — one or more images with optional per-image max
  width/height and a row-level alignment (`left` / `center` / `right`).
- **Divider** — a plain horizontal rule.
- **Spacer** (inline) — a `gap` (inline horizontal space) or `newline`
  (line break) placed between text spans.

### Headings & lists

Standard block styles (`H1`–`H6`, `Normal`) and a bulleted list style are
available from the block-style dropdown, same as any Portable Text editor.

### Example

![Quick Intro About Me](./markdown-examples/quick%20intro.png)

![Shawky with Clarity Apps Team](./markdown-examples/microsoft%20internship%20experience.png)

![Shawky with Clarity Apps Team](./markdown-examples/microsoft%20clarity%20apps%20team.png)
