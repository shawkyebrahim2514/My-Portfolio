#!/usr/bin/env node
/**
 * Sets the About-page Featured Follows list to a starter mix.
 * Safe to rerun; pass --force to replace an existing list.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/mark-follows-featured-in-about.mjs --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2023-01-01' })
const FORCE = process.argv.includes('--force')

const FEATURED_URLS = [
  'https://www.youtube.com/@MetwallyLabs',
  'https://essamcafe.com/',
  'https://www.linkedin.com/in/metwally/',
]

async function run() {
  const portfolio = await client.fetch(
    `*[_type == "portfolio"][0]{
      _id,
      "aboutKey": pages[_type == "aboutPage"][0]._key,
      "featuredFollows": pages[_type == "aboutPage"][0].featuredFollows
    }`,
  )
  if (!portfolio?._id || !portfolio?.aboutKey) {
    console.error('Could not find an embedded aboutPage in the portfolio singleton.')
    process.exit(1)
  }

  const existing = Array.isArray(portfolio.featuredFollows) ? portfolio.featuredFollows : []
  if (existing.length > 0 && !FORCE) {
    console.log(`About already has ${existing.length} Featured Follow(s). Pass --force to replace.`)
    return
  }

  const follows = await client.fetch(`*[_type == "hubFollow" && url in $urls]{ _id, url, name }`, {
    urls: FEATURED_URLS,
  })
  const byUrl = new Map(follows.map((item) => [item.url, item]))
  const featuredFollows = FEATURED_URLS.flatMap((url, index) => {
    const item = byUrl.get(url)
    if (!item) return []
    return [{_type: 'featuredFollow', _key: `ff${index}`, _ref: item._id}]
  })

  if (featuredFollows.length === 0) {
    console.log('No matching Follows found for the starter About mix.')
    return
  }

  await client
    .patch(portfolio._id)
    .set({[`pages[_key=="${portfolio.aboutKey}"].featuredFollows`]: featuredFollows})
    .commit()

  console.log(`Set Featured Follows (${featuredFollows.length}) on About.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
