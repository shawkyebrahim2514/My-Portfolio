#!/usr/bin/env node
/**
 * Imports legacy remote image URLs into Sanity assets without removing their
 * source URLs. A document is patched only after its image upload succeeds.
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/migrate-persistent-images.mjs --with-user-token
 *   $env:SANITY_IMAGE_MIGRATION_DRY_RUN='1'; npx sanity exec scripts/migrate-persistent-images.mjs --with-user-token
 *   npx sanity exec scripts/migrate-persistent-images.mjs --with-user-token -- --report=C:\temp\report.json
 */

import {lookup} from 'node:dns/promises'
import {writeFile} from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'
import net from 'node:net'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2023-01-01'})
const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const REQUEST_TIMEOUT_MS = 12_000
const CONCURRENCY = 4
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run') || process.env.SANITY_IMAGE_MIGRATION_DRY_RUN === '1'
const reportPath = args.find((arg) => arg.startsWith('--report='))?.slice('--report='.length)

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

const blockedIpv4 = new net.BlockList()
for (const [network, prefix] of [
  ['0.0.0.0', 8],
  ['10.0.0.0', 8],
  ['100.64.0.0', 10],
  ['127.0.0.0', 8],
  ['169.254.0.0', 16],
  ['172.16.0.0', 12],
  ['192.0.0.0', 24],
  ['192.0.2.0', 24],
  ['192.88.99.0', 24],
  ['192.168.0.0', 16],
  ['198.18.0.0', 15],
  ['198.51.100.0', 24],
  ['203.0.113.0', 24],
  ['224.0.0.0', 4],
  ['240.0.0.0', 4],
]) {
  blockedIpv4.addSubnet(network, prefix, 'ipv4')
}
const blockedIpv6 = new net.BlockList()
for (const [network, prefix] of [
  ['::', 96],
  ['::ffff:0:0', 96],
  ['64:ff9b::', 96],
  ['64:ff9b:1::', 48],
  ['100::', 64],
  ['2001::', 32],
  ['2001:db8::', 32],
  ['2002::', 16],
  ['fc00::', 7],
  ['fe80::', 10],
  ['fec0::', 10],
  ['ff00::', 8],
]) {
  blockedIpv6.addSubnet(network, prefix, 'ipv6')
}

function isPublicIp(address) {
  const family = net.isIP(address)
  if (family === 4) return !blockedIpv4.check(address, 'ipv4')
  if (family === 6) return !blockedIpv6.check(address, 'ipv6')
  return false
}

async function resolvePublicAddress(hostname) {
  if (net.isIP(hostname)) throw new Error('IP-address URLs are not supported')
  const addresses = await lookup(hostname, {all: true, verbatim: true})
  const publicAddress = addresses.find(({address}) => isPublicIp(address))
  if (!publicAddress) throw new Error('URL must resolve to a public address')
  return publicAddress.address
}

function detectImageType(body) {
  if (body.length >= 3 && body[0] === 0xff && body[1] === 0xd8 && body[2] === 0xff) {
    return 'image/jpeg'
  }
  if (
    body.length >= 8 &&
    body.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return 'image/png'
  }
  if (body.length >= 6) {
    const signature = body.subarray(0, 6).toString('ascii')
    if (signature === 'GIF87a' || signature === 'GIF89a') return 'image/gif'
  }
  if (
    body.length >= 12 &&
    body.subarray(0, 4).toString('ascii') === 'RIFF' &&
    body.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp'
  }
  if (body.length >= 12 && body.subarray(4, 8).toString('ascii') === 'ftyp') {
    const brand = body.subarray(8, 12).toString('ascii')
    if (brand === 'avif' || brand === 'avis') return 'image/avif'
  }
  throw new Error('Downloaded content is not a supported raster image')
}

async function downloadImage(url, redirects = 0) {
  if (redirects > 4) throw new Error('Too many redirects')
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP(S) URLs are supported')
  if (url.port && !['80', '443'].includes(url.port)) {
    throw new Error('Only standard web ports are supported')
  }

  const address = await resolvePublicAddress(url.hostname)
  const request = url.protocol === 'https:' ? https.request : http.request

  return new Promise((resolve, reject) => {
    let settled = false
    const fail = (error) => {
      if (settled) return
      settled = true
      reject(error)
    }
    const req = request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        headers: {
          Accept: 'image/avif,image/webp,image/png,image/jpeg,image/gif',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 PersistentImageMigration/1.0',
        },
        lookup: (_hostname, options, callback) => {
          const family = net.isIP(address)
          callback(null, options.all ? [{address, family}] : address, family)
        },
      },
      (res) => {
        const status = res.statusCode ?? 500
        if ([301, 302, 303, 307, 308].includes(status) && res.headers.location) {
          res.resume()
          settled = true
          downloadImage(new URL(res.headers.location, url), redirects + 1).then(resolve, reject)
          return
        }
        if (status < 200 || status >= 300) {
          res.resume()
          fail(new Error(`Source returned HTTP ${status}`))
          return
        }
        const contentLength = Number(res.headers['content-length'] ?? 0)
        if (contentLength > MAX_IMAGE_BYTES) {
          res.resume()
          fail(new Error('Remote file is too large'))
          return
        }
        const chunks = []
        let size = 0
        res.on('data', (chunk) => {
          size += chunk.length
          if (size > MAX_IMAGE_BYTES) {
            fail(new Error('Remote file is too large'))
            req.destroy()
            return
          }
          chunks.push(chunk)
        })
        res.on('end', () => {
          if (settled) return
          try {
            const body = Buffer.concat(chunks)
            const contentType = detectImageType(body)
            settled = true
            resolve({body, contentType, finalUrl: url})
          } catch (error) {
            fail(error)
          }
        })
        res.on('error', fail)
      },
    )
    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      fail(new Error('Remote request timed out'))
      req.destroy()
    })
    req.on('error', fail)
    req.end()
  })
}

function extensionFor(contentType) {
  return {
    'image/avif': 'avif',
    'image/gif': 'gif',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }[contentType]
}

function filenameFor(url, contentType) {
  const basename = new URL(url).pathname.split('/').filter(Boolean).at(-1) ?? 'remote-image'
  const stem = basename.replace(/\.[a-z0-9]+$/i, '').replace(/[^a-z0-9_-]+/gi, '-').slice(0, 80)
  return `${stem || 'remote-image'}.${extensionFor(contentType)}`
}

function imageValue(assetId, sourceUrl) {
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: assetId},
    sourceUrl,
  }
}

function hasAsset(value) {
  return Boolean(value?.asset?._ref)
}

function collectJobs(node, document, path, jobs) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    node.forEach((item, index) => collectJobs(item, document, `${path}[${index}]`, jobs))
    return
  }

  const add = (sourceField, targetField) => {
    const url = node[sourceField]
    if (typeof url === 'string' && url && !hasAsset(node[targetField])) {
      jobs.push({document, node, path: `${path}.${targetField}`, targetField, url})
    }
  }

  if (node._type === 'hubFollow') {
    add('avatar', 'avatarAsset')
    add('coverImage', 'coverImageAsset')
  }
  if (node._type === 'hubEntry') {
    add('coverImage', 'coverImageAsset')
    if (node.channel && typeof node.channel === 'object') {
      const avatar = node.channel.avatar
      if (typeof avatar === 'string' && avatar && !hasAsset(node.channel.avatarAsset)) {
        jobs.push({
          document,
          node: node.channel,
          path: `${path}.channel.avatarAsset`,
          targetField: 'avatarAsset',
          url: avatar,
        })
      }
    }
  }
  if (node._type === 'aboutPage') add('personImage', 'personImageAsset')
  if (node._type === 'externalImage') add('url', 'asset')
  if (node._type === 'readingItem') add('faviconUrl', 'favicon')
  if (node._type === 'linkPreview') {
    add('imageUrl', 'image')
    add('faviconUrl', 'favicon')
  }
  if (node._type === 'facebookResource') add('thumbnailUrl', 'thumbnail')

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('_') || key === 'asset') continue
    collectJobs(value, document, `${path}.${key}`, jobs)
  }
}

async function runPool(values, task) {
  let cursor = 0
  const workers = Array.from({length: Math.min(CONCURRENCY, values.length)}, async () => {
    while (cursor < values.length) {
      const index = cursor
      cursor += 1
      await task(values[index], index)
    }
  })
  await Promise.all(workers)
}

async function run() {
  const documents = await client.fetch(`*[_type in $types]`, {types: documentTypes})
  const originals = new Map(documents.map((document) => [document._id, document]))
  const copies = documents.map((document) => structuredClone(document))
  const jobs = []
  copies.forEach((document) => collectJobs(document, document, '$', jobs))

  const urls = [...new Set(jobs.map((job) => job.url))]
  console.log(`Found ${jobs.length} image field(s) across ${urls.length} unique URL(s).`)
  if (dryRun) {
    console.log('Dry run only; no assets or documents changed.')
    return
  }

  const results = new Map()
  await runPool(urls, async (url, index) => {
    try {
      const image = await downloadImage(new URL(url))
      const asset = await client.assets.upload('image', image.body, {
        contentType: image.contentType,
        filename: filenameFor(url, image.contentType),
        source: {id: url, name: 'Imported from URL', url},
      })
      results.set(url, {assetId: asset._id, finalUrl: image.finalUrl.toString()})
      console.log(`[${index + 1}/${urls.length}] Imported ${new URL(url).hostname}`)
    } catch (error) {
      results.set(url, {error: error instanceof Error ? error.message : 'Import failed'})
      console.warn(`[${index + 1}/${urls.length}] Failed ${new URL(url).hostname}`)
    }
  })

  const changedIds = new Set()
  const failures = []
  for (const job of jobs) {
    const result = results.get(job.url)
    if (result?.assetId) {
      job.node[job.targetField] = imageValue(result.assetId, job.url)
      changedIds.add(job.document._id)
    } else {
      failures.push({
        documentId: job.document._id,
        documentType: job.document._type,
        path: job.path,
        url: job.url,
        error: result?.error ?? 'Import failed',
      })
    }
  }

  let patched = 0
  const patchFailures = []
  for (const document of copies.filter((item) => changedIds.has(item._id))) {
    const original = originals.get(document._id)
    const values = {}
    for (const [key, value] of Object.entries(document)) {
      if (key.startsWith('_')) continue
      if (JSON.stringify(value) !== JSON.stringify(original[key])) values[key] = value
    }
    try {
      await client
        .patch(document._id)
        .ifRevisionId(original._rev)
        .set(values)
        .commit({autoGenerateArrayKeys: true})
      patched += 1
    } catch (error) {
      patchFailures.push({
        documentId: document._id,
        error: error instanceof Error ? error.message : 'Patch failed',
      })
    }
  }

  const report = {
    discoveredFields: jobs.length,
    uniqueUrls: urls.length,
    importedUrls: [...results.values()].filter((result) => result.assetId).length,
    failedUrls: [...results.values()].filter((result) => result.error).length,
    patchedDocuments: patched,
    failures,
    patchFailures,
  }
  console.log(JSON.stringify({...report, failures: failures.length, patchFailures: patchFailures.length}, null, 2))
  if (reportPath) {
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
    console.log(`Wrote report to ${reportPath}`)
  }
  if (failures.length || patchFailures.length) process.exitCode = 1
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
