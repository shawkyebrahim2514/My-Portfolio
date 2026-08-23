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
const DIRECTORY_ID = 'hubChannelsDirectoryPage-singleton'

const FEATURED_URLS = new Set([
  'https://www.youtube.com/@MetwallyLabs',
  'https://essamcafe.com/',
  'https://www.linkedin.com/in/metwally/',
])

async function run() {
  const doc = await client.fetch(
    `*[_id == $id][0]{ _id, channels[]{ _key, url, featuredInAbout } }`,
    { id: DIRECTORY_ID },
  )
  if (!doc?._id || !Array.isArray(doc.channels)) {
    console.error('Hub Channels Directory singleton not found.')
    process.exit(1)
  }

  const patch = client.patch(doc._id)
  let changed = 0
  doc.channels.forEach((item) => {
    const next = FEATURED_URLS.has(item.url)
    if (Boolean(item.featuredInAbout) === next) return
    patch.set({ [`channels[_key=="${item._key}"].featuredInAbout`]: next })
    changed += 1
  })

  if (changed === 0) {
    console.log('No Follows featuredInAbout changes needed.')
    return
  }

  await patch.commit()
  console.log(`Updated featuredInAbout on ${changed} Follows item(s).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
