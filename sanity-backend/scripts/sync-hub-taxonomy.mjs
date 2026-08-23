#!/usr/bin/env node
/**
 * Upserts the Hub category set and retags Follows items from
 * scripts/data/follows-category-map.json. Does not replace the directory
 * document or wipe recommendedEntries. Safe to rerun.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/sync-hub-taxonomy.mjs --with-user-token
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2023-01-01' })
const DIRECTORY_ID = 'hubChannelsDirectoryPage-singleton'
const here = dirname(fileURLToPath(import.meta.url))

const readJson = (file) =>
  JSON.parse(readFileSync(join(here, file), 'utf8').replace(/^\uFEFF/, ''))

const CATEGORY_IDS = {
  software: 'hubCategory-software-engineering',
  career: 'hubCategory-career-growth',
  tech: 'hubCategory-productivity-tools',
  money: 'hubCategory-money',
  english: 'hubCategory-english',
  hardware: 'hubCategory-hardware',
  curiosity: 'hubCategory-curiosity',
  design: 'hubCategory-design-ux',
  faith: 'hubCategory-faith-reflection',
  family: 'hubCategory-family',
  life: 'hubCategory-humanity-life',
}

const iconManager = (iconName, path) => ({
  _type: 'icon.manager',
  icon: iconName,
  metadata: {
    iconName,
    inlineSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="${path}"/></svg>`,
    collectionId: 'mdi',
    collectionName: 'Material Design Icons',
    hFlip: false,
    vFlip: false,
    flip: '',
    rotate: 0,
    size: { width: 24, height: 24 },
  },
})

const CATEGORIES = [
  {
    _id: CATEGORY_IDS.software,
    title: 'Software',
    slug: 'software-engineering',
    description: 'Code, computer science, and how I learn to build.',
    accentColor: 'secondary',
    order: 1,
    icon: iconManager(
      'mdi:code-tags',
      'M14.6 16.6l4.6-4.6l-4.6-4.6L16 6l6 6l-6 6zm-5.2 0L4.8 12l4.6-4.6L8 6l-6 6l6 6z',
    ),
  },
  {
    _id: CATEGORY_IDS.career,
    title: 'Career',
    slug: 'career-growth',
    description: 'Paths, advice, and soft skills at work.',
    accentColor: 'base',
    order: 2,
    icon: iconManager(
      'mdi:chart-line',
      'M16 11.78l4.24-7.33l1.73 1l-5.23 9.05l-6.51-3.75L5.46 19H22v2H2V3h2v14.54L9.5 8z',
    ),
  },
  {
    _id: CATEGORY_IDS.tech,
    title: 'Tech',
    slug: 'tech',
    description: 'New tools, tech news, and things I try as they show up.',
    accentColor: 'secondary',
    order: 3,
    icon: iconManager(
      'mdi:tools',
      'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9c-2-2-5-2.4-7.4-1.3L9 6L6 9L1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
    ),
  },
  {
    _id: CATEGORY_IDS.money,
    title: 'Money',
    slug: 'money',
    description: 'Investing and everyday personal finance.',
    accentColor: 'base',
    order: 4,
    icon: iconManager(
      'mdi:cash',
      'M3 6h18v12H3zm9 3a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3M7 8a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2v-4a2 2 0 0 1-2-2z',
    ),
  },
  {
    _id: CATEGORY_IDS.english,
    title: 'English',
    slug: 'english',
    description: 'Learning English — shows, speech, and lessons.',
    accentColor: 'secondary',
    order: 5,
    icon: iconManager(
      'mdi:translate',
      'm12.87 15.07l-2.54-2.51l.03-.03A17.5 17.5 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5l3.11 3.11zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2zm-2.62 7l1.62-4.33L19.12 17z',
    ),
  },
  {
    _id: CATEGORY_IDS.hardware,
    title: 'Hardware',
    slug: 'hardware',
    description: 'Phones, PCs, and hands-on reviews.',
    accentColor: 'base',
    order: 6,
    icon: iconManager(
      'mdi:laptop',
      'M4 6h16v10H4m16 2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4c-1.11 0-2 .89-2 2v10a2 2 0 0 0 2 2H0v2h24v-2z',
    ),
  },
  {
    _id: CATEGORY_IDS.curiosity,
    title: 'Curiosity',
    slug: 'curiosity',
    description: 'Explainers and how the world works.',
    accentColor: 'secondary',
    order: 7,
    icon: iconManager(
      'mdi:lightbulb-on-outline',
      'M20 11h3v2h-3zM1 11h3v2H1zM13 1v3h-2V1zM4.92 3.5l2.13 2.14l-1.42 1.41L3.5 4.93zm12.03 2.13l2.12-2.13l1.43 1.43l-2.13 2.12zM12 6a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8c-1.79-1.04-3-2.98-3-5.2a6 6 0 0 1 6-6m2 15v1a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1zm-3-3h2v-2.13c1.73-.44 3-2.01 3-3.87a4 4 0 0 0-4-4a4 4 0 0 0-4 4c0 1.86 1.27 3.43 3 3.87z',
    ),
  },
  {
    _id: CATEGORY_IDS.design,
    title: 'Design',
    slug: 'design-ux',
    description: 'Graphic design and visual craft.',
    accentColor: 'base',
    order: 8,
    icon: iconManager(
      'mdi:palette',
      'M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5c0 .12.05.23.13.33c.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22m0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4c0-3.86-3.59-7-8-7m-5.5 6a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m3-4a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m5 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3m3 4a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3',
    ),
  },
  {
    _id: CATEGORY_IDS.faith,
    title: 'Faith',
    slug: 'faith-reflection',
    description: 'Islam, Quran, and da’wah.',
    accentColor: 'secondary',
    order: 9,
    icon: iconManager(
      'mdi:hand-heart',
      'M2 20h4V9H2zm19.83-7.12c.11-.25.17-.52.17-.8V11a2 2 0 0 0-2-2h-5.5l.92-4.65c.02-.1.03-.2.03-.31c0-.41-.17-.79-.44-1.06L14 2L7.59 8.41C7.21 8.79 7 9.3 7 9.83V19a2 2 0 0 0 2 2h9c.83 0 1.54-.5 1.84-1.22z',
    ),
  },
  {
    _id: CATEGORY_IDS.family,
    title: 'Family',
    slug: 'family',
    description: 'Manners, home, and parenting in Islam.',
    accentColor: 'base',
    order: 10,
    icon: iconManager(
      'mdi:home-heart',
      'm2 12l10-9l10 9h-3v8H5v-8zm10 6l.72-.66C15.3 15 17 13.46 17 11.57c0-1.54-1.21-2.75-2.75-2.75c-.87 0-1.7.41-2.25 1.05a3 3 0 0 0-2.25-1.05C8.21 8.82 7 10.03 7 11.57c0 1.89 1.7 3.43 4.28 5.77z',
    ),
  },
  {
    _id: CATEGORY_IDS.life,
    title: 'Life',
    slug: 'humanity-life',
    description: 'Conversations and lived experience.',
    accentColor: 'secondary',
    order: 11,
    icon: iconManager(
      'mdi:account-group',
      'M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42c-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.54 5.54 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13zM0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9c-.59.68-.95 1.62-.95 2.65V20zm24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65c2.56.34 4.45 1.51 4.45 2.9z',
    ),
  },
]

const key = () => `k${Math.random().toString(36).slice(2, 10)}`
const refs = (names) =>
  names.map((name) => ({
    _type: 'reference',
    _key: key(),
    _ref: CATEGORY_IDS[name],
  }))

const normalizeUrl = (url) => url.trim().replace(/\/+$/, '').toLowerCase()

const sameCategories = (current = [], nextNames) => {
  const currentIds = current.map((item) => item?._ref).filter(Boolean).sort()
  const nextIds = nextNames.map((name) => CATEGORY_IDS[name]).sort()
  return JSON.stringify(currentIds) === JSON.stringify(nextIds)
}

async function upsertCategories() {
  let created = 0
  let updated = 0

  for (const category of CATEGORIES) {
    const fields = {
      title: category.title,
      slug: { _type: 'slug', current: category.slug },
      description: category.description,
      accentColor: category.accentColor,
      order: category.order,
    }

    const existing = await client.getDocument(category._id)
    if (!existing) {
      await client.create({
        _id: category._id,
        _type: 'hubCategory',
        ...fields,
        icon: category.icon,
      })
      created += 1
    } else {
      const next = { ...fields }
      if (!existing.icon) next.icon = category.icon
      await client.patch(category._id).set(next).commit()
      updated += 1
    }

    const draftId = `drafts.${category._id}`
    const draft = await client.getDocument(draftId)
    if (draft) {
      const next = { ...fields }
      if (!draft.icon) next.icon = category.icon
      await client.patch(draftId).set(next).commit()
    }
  }

  console.log(`Categories: created ${created}, updated ${updated}.`)
}

async function retagFollows(map) {
  const follows = await client.fetch(`*[_type == "hubFollow"]{ _id, url, categories }`)
  const byUrl = new Map(
    Object.entries(map).map(([url, names]) => [normalizeUrl(url), names]),
  )
  const missing = []
  let changed = 0
  const tx = client.transaction()

  follows.forEach((item) => {
    const names = byUrl.get(normalizeUrl(item.url ?? ''))
    if (!names) {
      missing.push(item.url)
      return
    }
    if (sameCategories(item.categories, names)) return
    tx.patch(item._id, (patch) => patch.set({categories: refs(names)}))
    changed += 1
  })

  if (changed > 0) await tx.commit()
  console.log(`Follows: retagged ${changed} item(s).`)
  if (missing.length > 0) {
    console.warn(`No map entry for ${missing.length} item(s):`)
    missing.forEach((url) => console.warn(`  ${url}`))
  }
}

function updateLocalYoutubeJson(map) {
  const file = join(here, 'data/youtube-subscriptions.json')
  const items = readJson('data/youtube-subscriptions.json')
  const byUrl = new Map(
    Object.entries(map).map(([url, names]) => [normalizeUrl(url), names]),
  )
  const next = items.map((item) => {
    const url = `https://www.youtube.com/@${item.handle}`
    const names = byUrl.get(normalizeUrl(url))
    if (!names) return item
    return { ...item, categories: names.map((name) => CATEGORY_IDS[name]) }
  })
  writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`)
  console.log(`Updated local ${next.length} YouTube subscription records.`)
}

async function run() {
  const map = readJson('data/follows-category-map.json')
  await upsertCategories()
  await retagFollows(map)
  updateLocalYoutubeJson(map)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
