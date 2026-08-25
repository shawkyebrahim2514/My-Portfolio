import {createHash} from 'node:crypto'

export const DIRECTORY_ID = 'hubChannelsDirectoryPage-singleton'

export const normalizeUrl = (url) => String(url ?? '').trim().replace(/\/+$/, '').toLowerCase()

export const followIdForUrl = (url) => {
  const hash = createHash('sha1').update(normalizeUrl(url)).digest('hex').slice(0, 16)
  return `hubFollow-${hash}`
}

export const followRef = (url, key) => ({
  _type: 'reference',
  _key: key || `k${Math.random().toString(36).slice(2, 10)}`,
  _ref: followIdForUrl(url),
})
