#!/usr/bin/env node
/**
 * Appends curated Facebook, LinkedIn, and X creators to the Follows
 * directory. Does not replace existing items. Safe to rerun.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/add-social-creators.mjs --with-user-token
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getCliClient } from 'sanity/cli'
import { DIRECTORY_ID, followIdForUrl, followRef, normalizeUrl } from './lib/follow-id.mjs'

const client = getCliClient({ apiVersion: '2023-01-01' })
const here = dirname(fileURLToPath(import.meta.url))

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

const readJson = (file) =>
  JSON.parse(readFileSync(join(here, file), 'utf8').replace(/^\uFEFF/, ''))

const creators = readJson('data/social-creators.json')

const key = () => `k${Math.random().toString(36).slice(2, 10)}`
const ref = (_ref) => ({ _type: 'reference', _key: key(), _ref })

const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

const rgbToHslHsv = ({ r, g, b }) => {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min

  let h = 0
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6
    else if (max === gn) h = (bn - rn) / d + 2
    else h = (rn - gn) / d + 4
    h *= 60
    if (h < 0) h += 360
  }

  const l = (max + min) / 2
  const sHsl = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  const v = max
  const sHsv = max === 0 ? 0 : d / max

  return {
    hsl: { h, s: sHsl, l },
    hsv: { h, s: sHsv, v },
  }
}

const color = (hex) => {
  const rgb = hexToRgb(hex)
  const { hsl, hsv } = rgbToHslHsv(rgb)
  return {
    _type: 'color',
    hex,
    alpha: 1,
    hsl: { _type: 'hslaColor', a: 1, h: hsl.h, s: hsl.s, l: hsl.l },
    hsv: { _type: 'hsvaColor', a: 1, h: hsv.h, s: hsv.s, v: hsv.v },
    rgb: { _type: 'rgbaColor', a: 1, r: rgb.r, g: rgb.g, b: rgb.b },
  }
}

const toFollow = (entry) => ({
  _id: followIdForUrl(entry.url),
  _type: 'hubFollow',
  type: 'creator',
  name: entry.name,
  platform: entry.platform,
  url: entry.url,
  ...(entry.avatar ? { avatar: entry.avatar } : {}),
  note: entry.note,
  language: entry.language,
  accent: color(entry.accent),
  featured: false,
  featuredInAbout: false,
  hiddenInProduction: false,
  categories: entry.categories.map((name) => ref(CATEGORY_IDS[name])),
  tags: entry.tags,
})

function updateCategoryMap() {
  const file = join(here, 'data/follows-category-map.json')
  const map = readJson('data/follows-category-map.json')
  creators.forEach((entry) => {
    map[entry.url] = entry.categories
  })
  writeFileSync(file, `${JSON.stringify(map, null, 2)}\n`)
}

async function run() {
  const [doc, existingUrls] = await Promise.all([
    client.fetch(`*[_id == $id][0]{ _id, channels }`, { id: DIRECTORY_ID }),
    client.fetch(`*[_type == "hubFollow"].url`),
  ])
  if (!doc?._id) {
    console.error('Follows directory singleton not found.')
    process.exit(1)
  }

  const existing = new Set((existingUrls ?? []).map(normalizeUrl))
  const nextItems = creators
    .map(toFollow)
    .filter((item) => !existing.has(normalizeUrl(item.url)))

  if (nextItems.length === 0) {
    console.log('All social creators are already in the directory.')
    updateCategoryMap()
    return
  }

  const refs = nextItems.map((item) => followRef(item.url))
  const tx = client.transaction()
  nextItems.forEach((item) => tx.createIfNotExists(item))
  if ((doc.channels ?? []).length === 0) {
    tx.patch(doc._id, (patch) => patch.set({ channels: refs }))
  } else {
    tx.patch(doc._id, (patch) => patch.insert('after', 'channels[-1]', refs))
  }
  await tx.commit()
  updateCategoryMap()
  console.log(`Added ${nextItems.length} social creator(s).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
