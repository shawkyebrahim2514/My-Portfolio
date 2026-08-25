#!/usr/bin/env node
/**
 * Copies each Follows directory object into a hubFollow document, then
 * points the directory list at those documents. Never deletes items.
 * createIfNotExists: reruns skip documents that already exist.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/migrate-follows-to-documents.mjs --with-user-token
 */

import {writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'
import {DIRECTORY_ID, followIdForUrl, followRef} from './lib/follow-id.mjs'

const client = getCliClient({apiVersion: '2023-01-01'})
const here = dirname(fileURLToPath(import.meta.url))

const isReference = (item) => Boolean(item?._ref)

function toFollowDoc(item) {
  const {_id, _rev, _createdAt, _updatedAt, _key, _type, ...rest} = item
  return {
    _id: followIdForUrl(item.url),
    _type: 'hubFollow',
    ...rest,
    legacyKey: _key,
  }
}

async function run() {
  const publishedId = DIRECTORY_ID
  const draftId = `drafts.${DIRECTORY_ID}`
  const [published, draft] = await Promise.all([
    client.getDocument(publishedId),
    client.getDocument(draftId),
  ])
  const source = draft ?? published
  if (!source?._id) {
    console.error('Follows directory singleton not found.')
    process.exit(1)
  }

  const channels = Array.isArray(source.channels) ? source.channels : []
  if (channels.length === 0) {
    console.log('Directory has no items.')
    return
  }

  if (channels.every(isReference)) {
    console.log(`Already migrated (${channels.length} references).`)
    return
  }

  const objects = channels.filter((item) => item?.url && !isReference(item))
  if (objects.length === 0) {
    console.error('Directory items are mixed or missing URLs. Aborting.')
    process.exit(1)
  }

  const backupPath = join(here, 'data', 'directory-items-pre-follow-docs.json')
  writeFileSync(backupPath, `${JSON.stringify(objects, null, 2)}\n`)
  console.log(`Backup written: ${backupPath} (${objects.length} items)`)

  const refs = objects.map((item) => followRef(item.url, item._key))
  const tx = client.transaction()
  objects.forEach((item) => {
    tx.createIfNotExists(toFollowDoc(item))
  })
  tx.patch(publishedId, (patch) => patch.set({channels: refs}))
  if (draft) {
    tx.patch(draftId, (patch) => patch.set({channels: refs}))
  }
  await tx.commit({visibility: 'sync'})
  console.log(`Created/kept ${objects.length} Follow document(s) and linked the directory.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
