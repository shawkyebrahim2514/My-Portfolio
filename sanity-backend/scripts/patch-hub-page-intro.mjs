#!/usr/bin/env node
/**
 * Softens the live Hub page intro without replacing the singleton.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/patch-hub-page-intro.mjs --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2023-01-01' })
const HUB_PAGE_ID = 'hubPage-singleton'
const INTRO =
  'Notes and posts I keep coming back to — software engineering, faith, and everyday humanity.'

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
  const doc = await client.fetch(`*[_id == $id][0]{ _id }`, { id: HUB_PAGE_ID })
  if (!doc?._id) {
    console.error('Hub page singleton not found.')
    process.exit(1)
  }

  await client.patch(doc._id).set({ intro: [block(INTRO)] }).commit()
  console.log('Updated Hub page intro.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
