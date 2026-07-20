# My Portfolio

[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?style=flat&logo=vercel&logoColor=white)](https://www.shawkyebrahim.me)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Sanity](https://img.shields.io/badge/Sanity-CMS-F03E2F?logo=sanity&logoColor=white)](https://www.sanity.io)

My personal developer portfolio and curated Hub. Content is managed through
Sanity Studio and statically pre-rendered by a Vike + React + TypeScript
frontend.

**Live site: [www.shawkyebrahim.me](https://www.shawkyebrahim.me)**

<!--
  📸 Tip: add a screenshot at docs/screenshot.png and uncomment the line below
  for a hero preview (recommended size ~1280×640).
-->
<!-- ![Portfolio preview](docs/screenshot.png) -->

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Features](#features)
- [License](#license)
- [Contact](#contact)

## Tech Stack

**Frontend**

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vike](https://vike.dev) + [Vite 8](https://vite.dev) — routing, static
  pre-rendering, and development server
- CSS Modules and shared design tokens
- [react-spring](https://www.react-spring.dev) — animations
- [Font Awesome](https://fontawesome.com) — icons
- [Portable Text](https://www.portabletext.org/) — structured rich-content rendering
- [Vercel Analytics](https://vercel.com/analytics)

**Content / Backend**

- [Sanity](https://www.sanity.io) — headless CMS (Sanity Studio)

**Tooling**

- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) — testing
- Deployed on [Vercel](https://vercel.com)

## Project Structure

This is a monorepo with two independent workspaces:

```
My-Portfolio/
├── react-frontend/   # Vike + React statically pre-rendered frontend
│   ├── pages/         # Vike routes, data hooks, and page metadata
│   └── src/
│       ├── APIs/         # Sanity data fetching
│       ├── components/   # Reusable UI components
│       ├── containers/   # Page-level layout sections
│       ├── contexts/     # React context providers
│       └── Types/        # Frontend and Sanity content types
└── sanity-backend/   # Sanity Studio (content schemas & CMS)
    └── schemas/          # Portfolio content models
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended) and npm

### Frontend (`react-frontend`)

```bash
cd react-frontend
npm install
npm run dev
```

The app runs at <http://localhost:3000>.

### Content Studio (`sanity-backend`)

```bash
cd sanity-backend
npm install
npm run dev
```

Sanity Studio runs at <http://localhost:3333>.

Copy each workspace's `.env.example` when local overrides are needed. Ordinary
frontend work uses `npm run dev`. To test automatic URL metadata fetching from
Studio, run `npx vercel dev` in `react-frontend` so
`http://localhost:3000/api/link-preview` is available.

## Available Scripts

Run these inside `react-frontend/`:

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server                |
| `npm run build`   | Build and pre-render to `dist/client/`      |
| `npm run preview` | Preview the production build locally     |
| `npm test`        | Run the test suite with Vitest           |

## Features

- **Home** — a short introduction about me.
- **Skills** — languages, frameworks, tools, and concepts I work with.
- **Education** — degree and relevant coursework.
- **Experience** — internships and professional training.
- **Projects** — selected projects I've built.
- **Contact** — ways to get in touch.
- **Hub** — articles, channels, podcasts, reading lists, and rich authored
  content including link previews, media galleries, figures, notes, key
  takeaways, quotations, and expandable details.

All content is editable through the Sanity Studio without touching code.

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE)
file for details.

## Contact

Thanks for visiting! Questions or feedback are always welcome.

- **Email:** <shawkyebrahim2514@gmail.com>
- **LinkedIn:** [shawkyebrahim2514](https://www.linkedin.com/in/shawkyebrahim2514/)
