#!/usr/bin/env node
/**
 * Drops leftover Directory `channels` refs and per-Follow `featuredInAbout`.
 * Follows now come from the collection; About uses Featured Follows.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/unset-directory-channels.mjs --with-user-token
 */

import {getCliClient} from 'sanity/cli'
import {DIRECTORY_ID} from './lib/follow-id.mjs'

const client = getCliClient({apiVersion: '2023-01-01'})

async function run() {
  const directory = await client.fetch(`*[_id == $id][0]{ _id, channels }`, {id: DIRECTORY_ID})
  const leftoverFollows = await client.fetch(
    `count(*[_type == "hubFollow" && defined(featuredInAbout)])`,
  )

  const tx = client.transaction()
  if (directory?._id && directory.channels) {
    tx.patch(directory._id, (patch) => patch.unset(['channels']))
  }
  if (leftoverFollows > 0) {
    const ids = await client.fetch(`*[_type == "hubFollow" && defined(featuredInAbout)]._id`)
    ids.forEach((id) => tx.patch(id, (patch) => patch.unset(['featuredInAbout'])))
  }

  if (!directory?.channels && leftoverFollows === 0) {
    console.log('Nothing to unset.')
    return
  }

  await tx.commit()
  console.log(
    `Unset directory channels${directory?.channels ? '' : ' (already gone)'} and featuredInAbout on ${leftoverFollows} Follow(s).`,
  )
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
