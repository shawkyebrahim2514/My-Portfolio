#!/usr/bin/env node
/**
 * Updates Follows title/intro without replacing the directory items.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/patch-follows-page-copy.mjs --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2023-01-01' })
const DIRECTORY_ID = 'hubChannelsDirectoryPage-singleton'
const INTRO =
  'People and channels I keep up with. Short notes here — longer thoughts go in Posts.'

const block = (text) => ({
  _type: 'block',
  _key: `k${Math.random().toString(36).slice(2, 10)}`,
  style: 'normal',
  markDefs: [],
  children: [
    {
      _type: 'span',
      _key: `k${Math.random().toString(36).slice(2, 10)}`,
      text,
      marks: [],
    },
  ],
})

async function run() {
  const doc = await client.fetch(`*[_id == $id][0]{ _id }`, { id: DIRECTORY_ID })
  if (!doc?._id) {
    console.error('Follows directory singleton not found.')
    process.exit(1)
  }

  await client
    .patch(doc._id)
    .set({
      title: {
        highlightedText: 'Follows',
        subText: 'People and channels I follow',
      },
      intro: [block(INTRO)],
    })
    .commit()
  console.log('Updated Follows title and intro.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
