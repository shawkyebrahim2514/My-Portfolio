#!/usr/bin/env node
/**
 * Seeds the Hub Channels Directory singleton with real subscribed channels.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/seed-hub-channels-directory.mjs --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2023-01-01' })

const key = () => `k${Math.random().toString(36).slice(2, 10)}`
const block = (text, style = 'normal') => ({
  _type: 'block',
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
})
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

const DIRECTORY_ID = 'hubChannelsDirectoryPage-singleton'

const directoryPage = {
  _id: DIRECTORY_ID,
  _type: 'hubChannelsDirectoryPage',
  title: {
    highlightedText: 'Follows',
    subText: 'People and channels I follow',
  },
  intro: [
    block(
      'People and channels I keep up with. Short notes here — longer thoughts go in Posts.',
    ),
  ],
  channels: [
    {
      _key: key(),
      type: 'subscription',
      name: 'Metwally Labs',
      platform: 'youtube',
      url: 'https://www.youtube.com/@MetwallyLabs',
      note: 'Ahmed Metwally shares practical programming experience and professional engineering advice.',
      language: 'en',
      accent: color('#ef4444'),
      featured: true,
      featuredInAbout: true,
      hiddenInProduction: false,
      categories: [ref('hubCategory-software-engineering'), ref('hubCategory-career-growth')],
      tags: ['programming', 'career'],
    },
    {
      _key: key(),
      type: 'subscription',
      name: 'Branch Education',
      platform: 'youtube',
      url: 'https://www.youtube.com/@BranchEducation',
      note: 'This channel explains how electronic devices work internally. I enjoy it in my free time.',
      language: 'en',
      accent: color('#2563eb'),
      featured: true,
      hiddenInProduction: false,
      categories: [ref('hubCategory-curiosity'), ref('hubCategory-hardware')],
      tags: ['electronics', 'engineering'],
    },
    {
      _key: key(),
      type: 'subscription',
      name: 'متاع - Mataa3',
      platform: 'youtube',
      url: 'https://www.youtube.com/@mataa3',
      note: 'Podcast-style discussions about life, relationships, and choosing a life partner.',
      language: 'ar',
      accent: color('#7c573f'),
      featured: true,
      hiddenInProduction: false,
      categories: [ref('hubCategory-humanity-life'), ref('hubCategory-family')],
      tags: ['relationships', 'life'],
    },
    {
      _key: key(),
      type: 'subscription',
      name: 'اقتصاد منزلي - Ektesad Manzly',
      platform: 'youtube',
      url: 'https://www.youtube.com/@ektesadmanzly',
      note: 'Useful and practical videos around investing, finance habits, and money planning.',
      language: 'ar',
      accent: color('#0f766e'),
      featured: false,
      hiddenInProduction: false,
      categories: [ref('hubCategory-money')],
      tags: ['investing', 'finance'],
    },
    {
      _key: key(),
      type: 'subscription',
      name: 'Telling By Nour',
      platform: 'youtube',
      url: 'https://www.youtube.com/@TellingByNour',
      note: 'Nour shares personal life experiences from travel and dealing with people.',
      language: 'ar',
      accent: color('#7c3aed'),
      featured: false,
      hiddenInProduction: false,
      categories: [ref('hubCategory-humanity-life')],
      tags: ['travel', 'life'],
    },
    {
      _key: key(),
      type: 'subscription',
      name: 'Essam Cafe',
      platform: 'podcast',
      url: 'https://essamcafe.com/',
      note: 'Long-form conversations around software engineering, career growth, and practical lessons from real projects.',
      language: 'en',
      accent: color('#8b5e34'),
      featured: false,
      featuredInAbout: true,
      hiddenInProduction: false,
      categories: [ref('hubCategory-software-engineering'), ref('hubCategory-career-growth')],
      tags: ['podcast', 'career', 'engineering'],
    },
    {
      _key: key(),
      type: 'subscription',
      name: 'Untyped',
      platform: 'podcast',
      url: 'https://logaretm.com/untyped/',
      note: 'Thoughtful episodes on frontend engineering, developer experience, and building better products with clear tradeoffs.',
      language: 'en',
      accent: color('#4f46e5'),
      featured: false,
      hiddenInProduction: false,
      categories: [ref('hubCategory-software-engineering'), ref('hubCategory-design-ux')],
      tags: ['frontend', 'dx', 'podcast'],
    },
    {
      _key: key(),
      type: 'subscription',
      name: 'Metwally Podcast',
      platform: 'podcast',
      url: 'https://podcasters.spotify.com/pod/show/metwally/',
      note: 'Practical engineering insights and professional development topics from Ahmed Metwally in podcast format.',
      language: 'en',
      accent: color('#0f766e'),
      featured: false,
      hiddenInProduction: false,
      categories: [ref('hubCategory-software-engineering'), ref('hubCategory-career-growth')],
      tags: ['software', 'growth', 'podcast'],
    },
    {
      _key: key(),
      type: 'subscription',
      name: 'The CSS Podcast',
      platform: 'podcast',
      url: 'https://thecsspodcast.libsyn.com/',
      note: 'Focused CSS discussions that make layout, rendering, and modern styling patterns easier to reason about.',
      language: 'en',
      accent: color('#0ea5e9'),
      featured: false,
      hiddenInProduction: false,
      categories: [ref('hubCategory-software-engineering'), ref('hubCategory-design-ux')],
      tags: ['css', 'frontend', 'podcast'],
    },
    {
      _key: key(),
      type: 'subscription',
      name: 'Unhandled Exception',
      platform: 'podcast',
      url: 'https://unhandledexceptionpodcast.com/',
      note: 'Developer-to-developer conversations on engineering decisions, tooling, and lessons learned from shipping software.',
      language: 'en',
      accent: color('#6d28d9'),
      featured: false,
      hiddenInProduction: false,
      categories: [ref('hubCategory-software-engineering'), ref('hubCategory-career-growth')],
      tags: ['engineering', 'tools', 'podcast'],
    },
  ],
}

async function run() {
  await client.createOrReplace(directoryPage)
  await client.delete(`drafts.${DIRECTORY_ID}`).catch((error) => {
    console.warn(`Could not delete stale draft for ${DIRECTORY_ID}: ${error.message}`)
  })
  console.log(`Seeded ${DIRECTORY_ID} with ${directoryPage.channels.length} channels.`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
