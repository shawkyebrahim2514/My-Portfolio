#!/usr/bin/env node
/**
 * Creates the Follows page title and intro if they are missing.
 * Does not create Follows or replace live content. Safe to rerun.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/seed-hub-channels-directory.mjs --with-user-token
 */

import { getCliClient } from 'sanity/cli'
import { DIRECTORY_ID } from './lib/follow-id.mjs'

const client = getCliClient({ apiVersion: '2023-01-01' })

const key = () => `k${Math.random().toString(36).slice(2, 10)}`

const block = (text) => ({
  _type: 'block',
  _key: key(),
  style: 'normal',
  markDefs: [],
  children: [
    {
      _type: 'span',
      _key: key(),
      text,
      marks: [],
    },
  ],
})

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
}

async function run() {
  const existing = await client.fetch(`*[_id == $id][0]{ _id }`, { id: DIRECTORY_ID })
  if (existing?._id) {
    console.log(`${DIRECTORY_ID} already exists. Leaving title, intro, and Follows unchanged.`)
    return
  }

  await client.createIfNotExists(directoryPage)
  console.log(`Created ${DIRECTORY_ID} with title and intro. Follows come from Follow documents.`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
