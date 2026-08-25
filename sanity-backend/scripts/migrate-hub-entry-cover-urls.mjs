#!/usr/bin/env node
/**
 * Converts leftover Sanity-uploaded Hub entry covers into remote URL strings
 * so the Cover image URL + crop fields can edit them.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/migrate-hub-entry-cover-urls.mjs --with-user-token
 */

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2023-01-01'})

async function run() {
  const docs = await client.fetch(
    `*[_type == "hubEntry" && defined(coverImage.asset)]{_id, title, "url": coverImage.asset->url}`,
  )

  if (!docs.length) {
    console.log('No uploaded Hub covers left to convert.')
    return
  }

  let patched = 0
  for (const doc of docs) {
    if (!doc.url) {
      console.log(`Skip ${doc._id} (${doc.title}): asset has no URL`)
      continue
    }
    await client.patch(doc._id).set({coverImage: doc.url}).commit({autoGenerateArrayKeys: false})
    patched += 1
    console.log(`Converted ${doc._id} (${doc.title})`)
  }

  console.log(`Done. Converted ${patched}/${docs.length} cover image(s) to URLs.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
