import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/**
 * Content collections — the typed source of truth for the portfolio,
 * ported out of Sanity. MDX collections carry rich body content; `file`
 * loaders back the small structured lists (skills, contacts, courses).
 */

const dateRange = z.object({
  from: z.string(),
  to: z.string().optional(),
});

const about = defineCollection({
  loader: glob({ base: './src/content/about', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    personName: z.string(),
    position: z.string(),
    salutation: z.string(),
    seeking: z.string(),
    personImage: z.string(),
    resume: z.object({ text: z.string(), link: z.string().url() }),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    order: z.number().default(0),
    projectLink: z.string().url().optional(),
    demoLink: z.string().url().optional(),
    technologies: z.array(z.string()).default([]),
  }),
});

const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    kind: z.enum(['professional', 'internship', 'certificate']),
    date: dateRange.optional(),
    link: z.string().url().optional(),
    technologies: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

const education = defineCollection({
  loader: glob({ base: './src/content/education', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    location: z.string(),
    date: z.object({ start: z.string(), end: z.string() }),
    order: z.number().default(0),
  }),
});

const courses = defineCollection({
  loader: glob({ base: './src/content/courses', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    order: z.number().default(0),
  }),
});

const skills = defineCollection({
  loader: file('./src/content/skills/skills.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    category: z.string(),
    order: z.number().default(0),
  }),
});

const contacts = defineCollection({
  loader: file('./src/content/contacts/contacts.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    link: z.string().url(),
    order: z.number().default(0),
  }),
});

export const collections = {
  about,
  projects,
  experience,
  education,
  courses,
  skills,
  contacts,
};
