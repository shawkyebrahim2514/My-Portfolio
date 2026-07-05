#!/usr/bin/env node
/**
 * Seeds dummy Hub content (hubCategory + hubEntry docs, one of each `kind`,
 * plus an hubPage singleton) into the Sanity dataset so the new schema can be
 * exercised end-to-end (Studio editing + frontend querying) before any real
 * content is authored.
 *
 * SAFETY: refuses to run unless the resolved client's dataset is exactly
 * "staging" (pass --dataset=production --i-am-sure to override, which you
 * should never need to do for dummy/test data).
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/seed-hub-dummy-data.mjs --with-user-token
 *
 * Safe to re-run: uses deterministic `_id`s (createOrReplace), so re-running
 * just refreshes the same dummy docs instead of duplicating them.
 */

import { getCliClient } from 'sanity/cli'

const scriptArgs = process.argv.slice(2)
const ALLOW_PRODUCTION = scriptArgs.includes('--i-am-sure')
const datasetFlag = scriptArgs.find((a) => a.startsWith('--dataset='))
const TARGET_DATASET = datasetFlag ? datasetFlag.split('=')[1] : undefined

const client = getCliClient({ apiVersion: '2023-01-01', dataset: TARGET_DATASET })

if (client.config().dataset !== 'staging' && !ALLOW_PRODUCTION) {
  console.error(
    `Refusing to run against dataset "${client.config().dataset}". This script seeds ` +
      `throwaway dummy data and should only ever target "staging". Pass ` +
      `--dataset=staging explicitly if SANITY_STUDIO_DATASET isn't already set to staging, ` +
      `or --i-am-sure to override (not recommended).`,
  )
  process.exit(1)
}

const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: `k${Math.random().toString(36).slice(2, 10)}`,
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: `k${Math.random().toString(36).slice(2, 10)}`, text, marks: [] }],
})

const categories = [
  {
    _id: 'hubCategory-software-engineering',
    _type: 'hubCategory',
    title: 'Software Engineering',
    slug: { _type: 'slug', current: 'software-engineering' },
    description: 'Things I learn and build as a software engineer — code, architecture, tools.',
    accentColor: 'secondary',
    order: 1,
  },
  {
    _id: 'hubCategory-faith-reflection',
    _type: 'hubCategory',
    title: 'Faith & Reflection',
    slug: { _type: 'slug', current: 'faith-reflection' },
    description: 'Reflections and resources on faith.',
    accentColor: 'base',
    order: 2,
  },
  {
    _id: 'hubCategory-humanity-life',
    _type: 'hubCategory',
    title: 'Humanity & Life',
    slug: { _type: 'slug', current: 'humanity-life' },
    description: 'On being human — growth, relationships, and everyday life lessons.',
    accentColor: 'secondary',
    order: 3,
  },
]

const entries = [
  {
    _id: 'hubEntry-dummy-article-clean-architecture',
    _type: 'hubEntry',
    title: '[DUMMY] Notes on Clean Architecture in React Apps',
    slug: { _type: 'slug', current: 'notes-on-clean-architecture-in-react-apps' },
    kind: 'article',
    categories: [{ _type: 'reference', _ref: 'hubCategory-software-engineering', _key: 'cat1' }],
    tags: ['react', 'architecture', 'frontend'],
    excerpt: 'A few practical patterns I keep reaching for when structuring larger React codebases.',
    publishedAt: new Date().toISOString(),
    featured: true,
    body: [
      block('This is placeholder dummy content used to validate the hubEntry schema end-to-end.'),
      block('Key Takeaways', 'h3'),
      block('Separate data-fetching from presentation. Keep components dumb where possible.'),
    ],
  },
  {
    _id: 'hubEntry-dummy-video-system-design',
    _type: 'hubEntry',
    title: '[DUMMY] System Design Primer (YouTube)',
    slug: { _type: 'slug', current: 'system-design-primer-youtube' },
    kind: 'video',
    categories: [{ _type: 'reference', _ref: 'hubCategory-software-engineering', _key: 'cat1' }],
    tags: ['system-design', 'video'],
    excerpt: 'A clear, well-paced walkthrough of core system design concepts. Great refresher.',
    sourceName: 'ByteByteGo — YouTube',
    sourceThumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    durationLabel: '18 min watch',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    featured: true,
    body: [block('My personal note: revisit the caching section, it maps well to our staging setup.')],
  },
  {
    _id: 'hubEntry-dummy-podcast-craft',
    _type: 'hubEntry',
    title: '[DUMMY] On the Craft of Software (Podcast)',
    slug: { _type: 'slug', current: 'on-the-craft-of-software-podcast' },
    kind: 'podcast',
    categories: [{ _type: 'reference', _ref: 'hubCategory-humanity-life', _key: 'cat1' }],
    tags: ['podcast', 'craft'],
    excerpt: 'A conversation about staying curious and humble while building software for decades.',
    sourceName: 'Software Engineering Radio',
    sourceThumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    externalUrl: 'https://example.com/podcast/on-the-craft-of-software',
    durationLabel: '52 min episode',
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    featured: false,
    body: [block('Loved the honesty in this episode about burnout and pacing yourself.')],
  },
  {
    _id: 'hubEntry-dummy-read-humility',
    _type: 'hubEntry',
    title: '[DUMMY] The Quiet Power of Humility',
    slug: { _type: 'slug', current: 'the-quiet-power-of-humility' },
    kind: 'read',
    categories: [{ _type: 'reference', _ref: 'hubCategory-faith-reflection', _key: 'cat1' }],
    tags: ['reflection', 'article'],
    excerpt: 'A short essay on humility as strength, not weakness — worth the five minutes.',
    sourceName: 'Example Blog',
    externalUrl: 'https://example.com/articles/the-quiet-power-of-humility',
    durationLabel: '5 min read',
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    featured: false,
    body: [block('Resonated a lot with this — bookmarking to revisit.')],
  },
  {
    _id: 'hubEntry-dummy-book-atomic-habits',
    _type: 'hubEntry',
    title: '[DUMMY] Atomic Habits',
    slug: { _type: 'slug', current: 'atomic-habits' },
    kind: 'book',
    categories: [{ _type: 'reference', _ref: 'hubCategory-humanity-life', _key: 'cat1' }],
    tags: ['book', 'habits', 'productivity'],
    excerpt: 'Practical, well-structured advice on building good habits and breaking bad ones.',
    sourceName: 'James Clear',
    externalUrl: 'https://jamesclear.com/atomic-habits',
    durationLabel: '4-5 hr read',
    publishedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    featured: true,
    body: [block('The "1% better every day" framing is what stuck with me most.')],
  },
]

const hubPage = {
  _id: 'hubPage-singleton',
  _type: 'hubPage',
  title: { highlightedText: 'Hub', subText: 'What I share' },
  intro: [
    block(
      'A place where I document and share what I learn and think about — software engineering, faith, and everyday humanity.',
    ),
  ],
}

async function run() {
  console.log(`Seeding dummy Hub data into dataset "${client.config().dataset}"...`)

  for (const doc of [...categories, ...entries, hubPage]) {
    await client.createOrReplace(doc)
    console.log(`  upserted ${doc._type}: ${doc._id}`)
  }

  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
