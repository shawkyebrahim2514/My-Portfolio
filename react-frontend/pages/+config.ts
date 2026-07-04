// Global Vike config: site-wide defaults for <head> tags, mirroring the
// previous shared index.html meta block — individual pages override
// title/description via their own +config.ts (see pages/<route>/+config.ts).
// Favicon/manifest/JSON-LD live in +Head.tsx (see https://vike.dev/Head).
import vikeReact from 'vike-react/config';
import type { Config } from 'vike/types';

export default {
  extends: [vikeReact],
  prerender: true,
  title: 'Shawky Ebrahim — Software Engineer',
  description:
    'Portfolio of Shawky Ebrahim — Software Engineer at Microsoft. Explore my skills, education, professional experience, and projects.',
  image: 'https://shawkyebrahim.vercel.app/og-image.png',
} satisfies Config;
