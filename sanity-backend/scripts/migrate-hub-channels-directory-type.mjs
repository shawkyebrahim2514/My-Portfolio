#!/usr/bin/env node
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2023-01-01'})
const FORCED_CREATOR_PLATFORMS = new Set(['github', 'linkedin', 'facebook', 'twitter'])

const isValidType = (value) => value === 'subscription' || value === 'creator'

const resolveType = (item) => {
  if (FORCED_CREATOR_PLATFORMS.has(item?.platform)) return 'creator'
  if (isValidType(item?.type)) return item.type
  return 'subscription'
}

async function run() {
  const docs = await client.fetch(
    `*[_type == "hubChannelsDirectoryPage" && count(channels) > 0]{ _id, title, channels }`,
  )

  if (!Array.isArray(docs) || docs.length === 0) {
    console.log('No hubChannelsDirectoryPage documents found.')
    return
  }

  let tx = client.transaction()
  let changedDocs = 0
  let changedItems = 0

  docs.forEach((doc) => {
    let docChanged = false
    const nextChannels = (doc.channels ?? []).map((item) => {
      const nextType = resolveType(item)
      if (item?.type === nextType) return item
      docChanged = true
      changedItems += 1
      return {...item, type: nextType}
    })

    if (docChanged) {
      changedDocs += 1
      tx = tx.patch(doc._id, (patch) => patch.set({channels: nextChannels}))
    }
  })

  if (changedDocs === 0) {
    console.log('All directory items already have the expected type values.')
    return
  }

  await tx.commit()
  console.log(`Updated ${changedItems} item(s) across ${changedDocs} document(s).`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
