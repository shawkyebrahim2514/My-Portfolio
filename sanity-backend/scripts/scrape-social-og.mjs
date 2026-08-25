#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const urls = process.argv.slice(2)
const results = {}

const extract = (html, prop) => {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return match[1]
  }
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return title?.[1]?.trim() ?? ''
}

for (const url of urls) {
  const res = spawnSync(
    'curl.exe',
    ['-sL', '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', '--max-time', '20', url],
    { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 },
  )
  const html = res.stdout || ''
  results[url] = {
    title: extract(html, 'og:title') || extract(html, 'twitter:title'),
    description: extract(html, 'og:description') || extract(html, 'twitter:description'),
    image: extract(html, 'og:image') || extract(html, 'twitter:image'),
    status: res.status,
    length: html.length,
  }
  process.stdout.write(`${url}\t${results[url].title || '(none)'}\n`)
}

writeFileSync(
  new URL('./data/social-og-cache.json', import.meta.url),
  JSON.stringify(results, null, 2),
)
