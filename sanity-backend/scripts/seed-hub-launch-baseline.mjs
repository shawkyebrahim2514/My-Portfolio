#!/usr/bin/env node
/**
 * Seeds a production-safe Hub launch baseline:
 * - Ensures core Hub categories + hubPage singleton exist
 * - Adds one public starter article entry (if missing)
 * - Wires About featured entries + software-engineering recommendations
 *   to real entries that actually exist in the dataset
 * - Marks legacy [DUMMY] entries hidden in production
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/seed-hub-launch-baseline.mjs --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const scriptArgs = process.argv.slice(2)
const datasetFlag = scriptArgs.find((arg) => arg.startsWith('--dataset='))
const targetDataset = datasetFlag ? datasetFlag.split('=')[1] : undefined
const client = getCliClient({ apiVersion: '2023-01-01', dataset: targetDataset })

const key = () => `k${Math.random().toString(36).slice(2, 10)}`
const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
})
const bullet = (text) => ({ ...block(text), listItem: 'bullet', level: 1 })
const numbered = (text) => ({ ...block(text), listItem: 'number', level: 1 })

const categories = [
  {
    _id: 'hubCategory-software-engineering',
    _type: 'hubCategory',
    title: 'Software Engineering',
    slug: { _type: 'slug', current: 'software-engineering' },
    description: 'Things I learn and build as a software engineer — code, architecture, and tools.',
    accentColor: 'secondary',
    order: 1,
  },
  {
    _id: 'hubCategory-career-growth',
    _type: 'hubCategory',
    title: 'Career & Growth',
    slug: { _type: 'slug', current: 'career-growth' },
    description: 'Lessons on growing as an engineer — communication, learning, and consistency.',
    accentColor: 'base',
    order: 2,
  },
  {
    _id: 'hubCategory-productivity-tools',
    _type: 'hubCategory',
    title: 'Productivity & Tools',
    slug: { _type: 'slug', current: 'productivity-tools' },
    description: 'Workflows and tools that keep execution focused and repeatable.',
    accentColor: 'secondary',
    order: 3,
  },
  {
    _id: 'hubCategory-faith-reflection',
    _type: 'hubCategory',
    title: 'Faith & Reflection',
    slug: { _type: 'slug', current: 'faith-reflection' },
    description: 'Reflections and resources on faith.',
    accentColor: 'base',
    order: 4,
  },
  {
    _id: 'hubCategory-humanity-life',
    _type: 'hubCategory',
    title: 'Humanity & Life',
    slug: { _type: 'slug', current: 'humanity-life' },
    description: 'On growth, relationships, and everyday life lessons.',
    accentColor: 'secondary',
    order: 5,
  },
]

const HUB_PAGE_ID = 'hubPage-singleton'
const ARTICLE_ID = 'hubEntry-article-shipping-hub-to-production'
const SOFTWARE_ENGINEERING_CATEGORY_ID = 'hubCategory-software-engineering'

const hubPage = {
  _id: HUB_PAGE_ID,
  _type: 'hubPage',
  title: { highlightedText: 'Hub', subText: 'What I share' },
  intro: [
    block(
      'A place where I share practical engineering lessons, curated resources, and thoughtful recommendations worth revisiting.',
    ),
    block(
      'This collection is intentionally editorial: fewer items, stronger signal, and steady updates over time.',
    ),
  ],
}

const starterArticle = {
  _id: ARTICLE_ID,
  _type: 'hubEntry',
  title: 'Shipping a content hub to production',
  slug: { _type: 'slug', current: 'shipping-a-content-hub-to-production' },
  kind: 'article',
  language: 'en',
  excerpt:
    'A practical launch checklist for content hubs: clean schemas, safe visibility controls, and repeatable release workflows.',
  categories: [
    { _type: 'reference', _key: key(), _ref: 'hubCategory-software-engineering' },
    { _type: 'reference', _key: key(), _ref: 'hubCategory-productivity-tools' },
  ],
  tags: ['sanity', 'frontend', 'workflow'],
  durationLabel: '8 min read',
  body: [
    block(
      'A Hub is more than a list of posts: it is a publishing system. Launch quality depends on the content model and rollout process as much as on visual polish.',
    ),
    block('What matters before launch', 'h2'),
    bullet('One schema per content intent, with clear validation and publishing defaults.'),
    bullet('A no-surprises preview flow so hidden or in-progress entries stay out of production listings.'),
    bullet('Seed scripts that are deterministic and safe to rerun across environments.'),
    block('A repeatable release flow', 'h2'),
    numbered('Create or update real seed entries with stable IDs.'),
    numbered('Set featured and recommended references from existing docs only.'),
    numbered('Hide legacy dummy entries instead of deleting historical references immediately.'),
    numbered('Run frontend build + Hub-focused tests before promoting to production.'),
    block('Why this approach works', 'h2'),
    block(
      'It keeps editorial velocity high without compromising production safety. Authors can keep iterating in Studio while the public surface remains intentionally curated.',
    ),
  ],
  publishedAt: new Date().toISOString(),
  featured: true,
  featuredInCategory: true,
  hiddenInProduction: false,
}

const desiredEntryOrder = [
  ARTICLE_ID,
  'hubEntry-reading-developer-mindset',
  'hubEntry-podcast-essam-cafe',
  'hubEntry-channel-mataa3',
]

async function getExistingEntryIds(ids) {
  const found = await client.fetch(`*[_type == "hubEntry" && _id in $ids]._id`, { ids })
  return new Set(found ?? [])
}

async function seedCategoriesAndHubPage() {
  for (const category of categories) {
    await client.createIfNotExists(category)
  }
  await client.createIfNotExists(hubPage)
}

async function seedStarterArticle() {
  await client.createIfNotExists(starterArticle)
  await client.delete(`drafts.${ARTICLE_ID}`).catch((error) => {
    console.warn(`Could not delete stale draft for ${ARTICLE_ID}: ${error.message}`)
  })
}

async function wireFeaturedInAbout(entryIds) {
  const portfolio = await client.fetch(
    `*[_type == "portfolio"][0]{ _id, "aboutKey": pages[_type == "aboutPage"][0]._key }`,
  )
  if (!portfolio?._id || !portfolio?.aboutKey) {
    console.warn('Could not find portfolio/aboutPage to set featuredInAbout.')
    return
  }

  const featuredIds = desiredEntryOrder.filter((id) => entryIds.has(id))
  if (featuredIds.length === 0) {
    console.warn('No matching Hub entries found for featuredInAbout; skipping.')
    return
  }

  const featuredInAbout = featuredIds.map((id, i) => ({
    _type: 'featuredHubEntry',
    _key: `feat${i}`,
    _ref: id,
  }))

  await client
    .patch(portfolio._id)
    .set({ [`pages[_key=="${portfolio.aboutKey}"].featuredInAbout`]: featuredInAbout })
    .commit()

  console.log(`Set featuredInAbout with ${featuredIds.length} entries.`)
}

async function wireRecommendedEntries(entryIds) {
  const recommendedIds = desiredEntryOrder.filter((id) => entryIds.has(id))
  if (recommendedIds.length === 0) {
    console.warn('No matching Hub entries found for recommendedEntries; skipping.')
    return
  }

  const recommendedEntries = recommendedIds.map((id, i) => ({
    _type: 'reference',
    _key: `rec${i}`,
    _ref: id,
  }))

  await client.patch(SOFTWARE_ENGINEERING_CATEGORY_ID).set({ recommendedEntries }).commit()
  console.log(
    `Set recommendedEntries (${recommendedIds.length}) on ${SOFTWARE_ENGINEERING_CATEGORY_ID}.`,
  )
}

async function hideDummyEntries() {
  const dummies = await client.fetch(
    `*[_type == "hubEntry" && title match "[DUMMY]*"]{ _id, hiddenInProduction }`,
  )
  const visibleDummies = (dummies ?? []).filter((doc) => !doc.hiddenInProduction)
  if (visibleDummies.length === 0) {
    console.log('No visible [DUMMY] entries to hide.')
    return
  }

  let tx = client.transaction()
  for (const doc of visibleDummies) {
    tx = tx.patch(doc._id, (patch) => patch.set({ hiddenInProduction: true }))
  }
  await tx.commit()
  console.log(`Marked ${visibleDummies.length} [DUMMY] entries hidden in production.`)
}

async function run() {
  console.log(`Seeding Hub launch baseline into dataset "${client.config().dataset}"...`)

  await seedCategoriesAndHubPage()
  await seedStarterArticle()

  const entryIds = await getExistingEntryIds(desiredEntryOrder)
  await wireFeaturedInAbout(entryIds)
  await wireRecommendedEntries(entryIds)
  await hideDummyEntries()

  console.log('Done.')
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
