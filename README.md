# My Portfolio

[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?style=flat&logo=vercel&logoColor=white)](https://shawkyebrahim.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Sanity](https://img.shields.io/badge/Sanity-CMS-F03E2F?logo=sanity&logoColor=white)](https://www.sanity.io)

My personal developer portfolio — a fast, responsive single-page application
that showcases my skills, experience, education, and projects. Content is
managed through a Sanity CMS and rendered by a React + TypeScript frontend.

**🔗 Live site: [shawkyebrahim.vercel.app](https://shawkyebrahim.vercel.app)**

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

- [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) — build tool & dev server
- [React Router](https://reactrouter.com) — client-side routing
- [Emotion](https://emotion.sh) — CSS-in-JS styling
- [react-spring](https://www.react-spring.dev) — animations
- [Font Awesome](https://fontawesome.com) — icons
- [react-markdown](https://github.com/remarkjs/react-markdown) — Markdown content rendering
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
├── react-frontend/   # React + Vite single-page application
│   └── src/
│       ├── APIs/         # Sanity data fetching
│       ├── components/   # Reusable UI components
│       ├── containers/   # Page-level layout sections
│       ├── contexts/     # React context providers
│       └── Portfolio/    # Page composition
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

The app opens automatically at <http://localhost:5173>.

### Content Studio (`sanity-backend`)

```bash
cd sanity-backend
npm install
npm run dev
```

Sanity Studio runs at <http://localhost:3333>.

## Available Scripts

Run these inside `react-frontend/`:

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server                |
| `npm run build`   | Build for production (outputs to `build/`) |
| `npm run preview` | Preview the production build locally     |
| `npm test`        | Run the test suite with Vitest           |

## Features

- **Home** — a short introduction about me.
- **Skills** — languages, frameworks, tools, and concepts I work with.
- **Education** — degree and relevant coursework.
- **Experience** — internships and professional training.
- **Projects** — selected projects I've built.
- **Contact** — ways to get in touch.

All content is editable through the Sanity Studio without touching code.

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE)
file for details.

## Contact

Thanks for visiting! Questions or feedback are always welcome.

- **Email:** <shawkyebrahim2514@gmail.com>
- **LinkedIn:** [shawkyebrahim2514](https://www.linkedin.com/in/shawkyebrahim2514/)
