#!/usr/bin/env node

import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2023-01-01'})
const dryRun = process.env.SANITY_IMAGE_CLEANUP_DRY_RUN === '1'
const documentTypes = [
  'portfolio',
  'professionalExperience',
  'internships',
  'collegeCourses',
  'projects',
  'certificates',
  'skills',
  'contacts',
  'hubPage',
  'hubEntry',
  'hubCategory',
  'hubFollow',
  'hubChannelsDirectoryPage',
  'hubLibraryPage',
  'hubLibrarySave',
  'hubLibraryCollection',
]

function hasAsset(value) {
  return Boolean(value?.asset?._ref)
}

function childPath(path, field) {
  return path ? `${path}.${field}` : field
}

function collectLegacyFields(node, path, removals, blockers, replacements) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    node.forEach((item, index) =>
      collectLegacyFields(item, `${path}[${index}]`, removals, blockers, replacements),
    )
    return
  }

  const remove = (sourceField, targetField, allowMissingAsset = false) => {
    const sourceUrl = node[sourceField]
    if (typeof sourceUrl !== 'string' || !sourceUrl) return
    if (!hasAsset(node[targetField]) && !allowMissingAsset) {
      blockers.push(childPath(path, sourceField))
      return
    }
    removals.push(childPath(path, sourceField))
  }

  if (node._type === 'hubFollow') {
    remove('avatar', 'avatarAsset')
    remove('coverImage', 'coverImageAsset')
  }
  if (node._type === 'hubEntry') {
    remove('coverImage', 'coverImageAsset')
    if (node.channel && typeof node.channel === 'object') {
      const avatar = node.channel.avatar
      if (typeof avatar === 'string' && avatar) {
        if (hasAsset(node.channel.avatarAsset)) removals.push(childPath(path, 'channel.avatar'))
        else blockers.push(childPath(path, 'channel.avatar'))
      }
    }
  }
  if (node._type === 'aboutPage') remove('personImage', 'personImageAsset')
  if (node._type === 'externalImage') remove('url', 'asset')
  if (node._type === 'readingItem') remove('faviconUrl', 'favicon')
  if (node._type === 'linkPreview') {
    remove('imageUrl', 'image')
    remove('faviconUrl', 'favicon')
  }
  if (node._type === 'facebookResource') {
    remove('thumbnailUrl', 'thumbnail')
    if (node.thumbnailSource === 'external' && hasAsset(node.thumbnail)) {
      replacements[childPath(path, 'thumbnailSource')] = 'sanity'
    }
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('_') || key === 'asset') continue
    collectLegacyFields(value, childPath(path, key), removals, blockers, replacements)
  }
}

const documents = await client.fetch('*[_type in $types]', {types: documentTypes})
const plans = documents.map((document) => {
  const removals = []
  const blockers = []
  const replacements = {}
  collectLegacyFields(document, '', removals, blockers, replacements)
  return {document, removals, blockers, replacements}
})
const blockers = plans.flatMap(({document, blockers: paths}) =>
  paths.map((path) => `${document._id}: ${path}`),
)

if (blockers.length) {
  console.error('Refusing cleanup because these displayed URLs have no persistent asset:')
  blockers.forEach((blocker) => console.error(`- ${blocker}`))
  process.exit(1)
}

const changed = plans.filter(
  ({removals, replacements}) => removals.length || Object.keys(replacements).length,
)
const removedFieldCount = changed.reduce((count, {removals}) => count + removals.length, 0)
console.log(
  `${dryRun ? 'Would clean' : 'Cleaning'} ${removedFieldCount} legacy image field(s) across ${changed.length} document(s).`,
)

if (!dryRun) {
  for (const {document, removals, replacements} of changed) {
    let patch = client.patch(document._id).ifRevisionId(document._rev)
    if (removals.length) patch = patch.unset(removals)
    if (Object.keys(replacements).length) patch = patch.set(replacements)
    await patch.commit()
  }
}
