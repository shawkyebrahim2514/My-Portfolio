#!/usr/bin/env node
/**
 * Creates curated YouTube Follow documents if they are missing.
 * Does not replace existing items. Safe to rerun.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/add-youtube-subscriptions.mjs --with-user-token
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getCliClient } from 'sanity/cli'
import { followIdForUrl, normalizeUrl } from './lib/follow-id.mjs'

const client = getCliClient({ apiVersion: '2023-01-01' })
const here = dirname(fileURLToPath(import.meta.url))

const readJson = (file) =>
  JSON.parse(readFileSync(join(here, file), 'utf8').replace(/^\uFEFF/, ''))

const subscriptions = readJson('data/youtube-subscriptions.json')
const avatars = readJson('data/youtube-channel-avatars.json')

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

const toFollow = (entry) => {
  const avatar = avatars[entry.handle]?.avatar
  const url = `https://www.youtube.com/@${entry.handle}`
  return {
    _id: followIdForUrl(url),
    _type: 'hubFollow',
    type: 'subscription',
    name: entry.name,
    platform: 'youtube',
    url,
    ...(avatar ? { avatar } : {}),
    note: entry.note,
    language: entry.language,
    accent: color(entry.accent),
    featured: false,
    hiddenInProduction: false,
    categories: entry.categories.map(ref),
    tags: entry.tags,
  }
}

async function run() {
  const existingUrls = await client.fetch(`*[_type == "hubFollow"].url`)
  const existing = new Set((existingUrls ?? []).map(normalizeUrl))
  const nextItems = subscriptions
    .map(toFollow)
    .filter((item) => !existing.has(normalizeUrl(item.url)))

  if (nextItems.length === 0) {
    console.log('All YouTube subscriptions already exist as Follows.')
    return
  }

  const tx = client.transaction()
  nextItems.forEach((item) => tx.createIfNotExists(item))
  await tx.commit()
  console.log(`Added ${nextItems.length} YouTube Follow(s).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
