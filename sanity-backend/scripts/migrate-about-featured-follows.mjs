#!/usr/bin/env node
/**
 * Copies Follows that were flagged `featuredInAbout` onto the About page
 * Featured Follows list. Uses leftover Directory order when present.
 * Skips if that list already has items unless --force is passed.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/migrate-about-featured-follows.mjs --with-user-token
 */

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2023-01-01'})
const FORCE = process.argv.includes('--force')

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

  const [directoryIds, flagged] = await Promise.all([
    client.fetch(`*[_type == "hubChannelsDirectoryPage"][0].channels[]._ref`),
    client.fetch(`*[_type == "hubFollow" && featuredInAbout == true]{_id, name, url}`),
  ])

  const flaggedById = new Map(flagged.map((item) => [item._id, item]))
  const orderedIds = []
  for (const id of directoryIds ?? []) {
    if (flaggedById.has(id) && !orderedIds.includes(id)) orderedIds.push(id)
  }
  for (const item of flagged) {
    if (!orderedIds.includes(item._id)) orderedIds.push(item._id)
  }

  if (orderedIds.length === 0) {
    console.log('No Follows with featuredInAbout found to copy.')
    return
  }

  const featuredFollows = orderedIds.map((id, index) => ({
    _type: 'featuredFollow',
    _key: `ff${index}`,
    _ref: id,
  }))

  await client
    .patch(portfolio._id)
    .set({[`pages[_key=="${portfolio.aboutKey}"].featuredFollows`]: featuredFollows})
    .commit()

  console.log(`Set Featured Follows (${orderedIds.length}) on About:`)
  for (const id of orderedIds) {
    const item = flaggedById.get(id)
    console.log(`  - ${item?.name ?? id}`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
