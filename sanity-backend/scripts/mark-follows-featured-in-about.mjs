#!/usr/bin/env node
/**
 * Sets featuredInAbout on selected Follows items without replacing the
 * directory document. Safe to rerun.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/mark-follows-featured-in-about.mjs --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2023-01-01' })

const FEATURED_URLS = new Set([
  'https://www.youtube.com/@MetwallyLabs',
  'https://essamcafe.com/',
  'https://www.linkedin.com/in/metwally/',
])

async function run() {
  const follows = await client.fetch(`*[_type == "hubFollow"]{ _id, url, featuredInAbout }`)
  const tx = client.transaction()
  let changed = 0
  follows.forEach((item) => {
    const next = FEATURED_URLS.has(item.url)
    if (Boolean(item.featuredInAbout) === next) return
    tx.patch(item._id, (patch) => patch.set({featuredInAbout: next}))
    changed += 1
  })

  if (changed === 0) {
    console.log('No Follows featuredInAbout changes needed.')
    return
  }

  await tx.commit()
  console.log(`Updated featuredInAbout on ${changed} Follows item(s).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
