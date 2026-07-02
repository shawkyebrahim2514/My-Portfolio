#!/usr/bin/env node
/**
 * One-time content migration: converts the 6 legacy bracket-DSL markdown
 * `description` fields (see react-frontend/README.md + src/components/
 * HTMLMarkdown/customPlugins/*) into the new Portable Text shape defined in
 * schemas/objects/richContent.ts.
 *
 * FIDELITY STRATEGY: rather than re-deriving the DSL semantics from scratch,
 * the mdast-level transforms below are ported verbatim (same regexes, same
 * order, same libraries: unist-util-visit + mdast-util-find-and-replace)
 * from react-frontend's actual customPlugins/{customText,customHighlightText,
 * customBlockquote}. Only the OUTPUT shape differs: instead of annotating
 * nodes with hName/hProperties (for react-markdown's hast pipeline), this
 * script converts the same fully-processed mdast tree directly into
 * Portable Text blocks/spans/marks/objects.
 *
 * SAFETY: refuses to run unless the resolved client's dataset is exactly
 * "staging" (pass --dataset=production --i-am-sure to override once, only
 * after full validation — see plan.md "Markdown redesign v2" section).
 *
 * Usage (run from sanity-backend/, via the Sanity CLI so a user auth token
 * is available without storing one in the repo or environment):
 *   npx sanity exec scripts/migrate-to-portable-text.mjs --with-user-token -- --dry-run
 *   npx sanity exec scripts/migrate-to-portable-text.mjs --with-user-token -- --commit
 */

import { getCliClient } from 'sanity/cli'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { visit } from 'unist-util-visit'
import { toString as mdastToString } from 'mdast-util-to-string'
import { findAndReplace } from 'mdast-util-find-and-replace'
import { randomUUID } from 'node:crypto'

const scriptArgs = process.argv.slice(2)
const DRY_RUN = !scriptArgs.includes('--commit')
const ALLOW_PRODUCTION = scriptArgs.includes('--i-am-sure')
const datasetFlag = scriptArgs.find((a) => a.startsWith('--dataset='))
const TARGET_DATASET = datasetFlag ? datasetFlag.split('=')[1] : undefined

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

// ---------------------------------------------------------------------------
// Step 1 — ported verbatim from customPlugins/customText/*.ts
// ---------------------------------------------------------------------------
function applyCustomText(tree) {
  visit(tree, (node) => {
    if (node && 'children' in node && node.children.some((child) => child.type === 'text')) {
      const plugins = [
        {
          // captureTextDirection
          regex: /\[(center|left|right)\]/,
          callback: (_fullText, align) => {
            node.data = { hProperties: { className: `md-align-${align}` } }
            return null
          },
        },
        {
          // captureNewline
          regex: /\[newline\]/,
          callback: () => ({
            type: 'paragraph',
            children: [],
            data: { hName: 'span', hProperties: { className: 'md-newline' } },
          }),
        },
        {
          // captureButton
          regex: /\[\[([a-zA-Z0-9\s]+)\]\]/,
          callback: (_fullText, content) => ({
            type: 'strong',
            children: [{ type: 'text', value: content }],
            data: { hProperties: { className: 'button' } },
          }),
        },
        {
          // captureGap
          regex: /\[gap\]/,
          callback: () => ({
            type: 'paragraph',
            children: [],
            data: { hName: 'span', hProperties: { className: 'md-gap' } },
          }),
        },
      ]
      plugins.forEach(({ regex, callback }) => {
        let exists = true
        while (exists) {
          exists = false
          findAndReplace(node, [
            regex,
            (...args) => {
              exists = true
              return callback(...args)
            },
          ])
        }
      })
    }
  })
}

// ---------------------------------------------------------------------------
// Step 2 — ported verbatim from customPlugins/customHighlightText.ts
// ---------------------------------------------------------------------------
const textVariationsRegexReplace = {
  highlightAreaWithSecondaryColor: { regex: /!-(.*?)-!$/, replace: { className: 'highlight-area secondary' } },
  highlightTextWithSecondaryColor: { regex: /!(.*?)!$/, replace: { className: 'secondary' } },
  highlightAreaWithBaseColor: { regex: /-(.*?)-$/, replace: { className: 'highlight-area' } },
}

function handleVariationReplace(variation, node) {
  let isMatched = false
  findAndReplace(node, [
    variation.regex,
    (_fullText, content) => {
      isMatched = true
      return {
        type: 'strong',
        children: [{ type: 'text', value: content }],
        data: { hProperties: { className: variation.replace.className } },
      }
    },
  ])
  return isMatched
}

function applyCustomHighlightText(tree) {
  visit(tree, 'strong', (node) => {
    if (node.children.length === 1) {
      for (const variation of Object.values(textVariationsRegexReplace)) {
        if (handleVariationReplace(variation, node)) break
      }
    } else {
      const nodeFullText = mdastToString(node)
      for (const variation of Object.values(textVariationsRegexReplace)) {
        if (variation.regex.test(nodeFullText)) {
          node.data = { hProperties: { className: variation.replace.className } }
          break
        }
      }
      node.children.pop()
      node.children.shift()
    }
  })
}

// ---------------------------------------------------------------------------
// Step 3 — ported verbatim from customPlugins/customBlockquote.ts
// ---------------------------------------------------------------------------
function applyCustomBlockquote(tree) {
  visit(tree, 'blockquote', (node) => {
    findAndReplace(node, [
      /\[!([^[]+)\]\s?([a-z]*)/,
      (_fullText, variation, titleText) => {
        node.data = { hProperties: { className: variation } }
        if (titleText === '') return null
        const titleParagraph = node.children[0]
        if (titleParagraph) {
          titleParagraph.type = 'heading'
          titleParagraph.depth = 5
        }
        return { type: 'text', value: titleText }
      },
    ])
  })
}

// ---------------------------------------------------------------------------
// Step 4 — image DSL (ported from customImage.ts, but extracting raw
// width/height numbers instead of derived CSS var strings, since the new
// schema stores numeric maxWidth/maxHeight fields, not CSS strings).
// ---------------------------------------------------------------------------
const imageRegex = /!\[([^\]]+)\]\(([^ ]+)\s?(?:=(?:(\d+)x(\d+)|(h|w)(\d+)))?(?:\|(center|left|right))?\)/

function extractImagesFromParagraph(node) {
  const nodeFullText = mdastToString(node)
  if (!imageRegex.test(nodeFullText)) return null
  const fragments = nodeFullText.split(imageRegex)
  const images = []
  let align = 'left'
  for (let i = 0; i < (fragments.length - 1) / 8; i++) {
    const range = i * 8
    const alt = fragments[range + 1]
    const url = fragments[range + 2]
    let width = fragments[range + 3]
    let height = fragments[range + 4]
    const widthOrHeight = fragments[range + 5]
    if (widthOrHeight) {
      if (widthOrHeight === 'w') width = fragments[range + 6]
      else height = fragments[range + 6]
    }
    align = fragments[range + 7] || align
    images.push({
      alt,
      url,
      maxWidth: width ? parseInt(width, 10) : undefined,
      maxHeight: height ? parseInt(height, 10) : undefined,
    })
  }
  return { images, align }
}

// ---------------------------------------------------------------------------
// Step 5 — mdast -> Portable Text
// ---------------------------------------------------------------------------

// Maps a fully-processed mdast inline node into 0+ Portable Text span/inline
// object entries, threading `activeMarks` (decorator names + markDef keys)
// down through nested emphasis/strong/link wrapping.
function convertInline(nodes, activeMarks, markDefs, warnings) {
  const out = []
  for (const node of nodes) {
    switch (node.type) {
      case 'text': {
        if (node.value === '') break
        out.push({ _type: 'span', _key: key(), text: node.value, marks: [...activeMarks] })
        break
      }
      case 'inlineCode': {
        out.push({ _type: 'span', _key: key(), text: node.value, marks: [...activeMarks, 'code'] })
        break
      }
      case 'break': {
        // remark-breaks hard line break inside a paragraph — represent as a
        // literal newline in the span text (renderer can `white-space:
        // pre-line` or split on \n; simplest + matches visual intent).
        out.push({ _type: 'span', _key: key(), text: '\n', marks: [...activeMarks] })
        break
      }
      case 'strong': {
        const className = node.data?.hProperties?.className
        let mark = 'strong'
        if (className === 'highlight-area secondary') mark = 'highlightAreaSecondary'
        else if (className === 'secondary') mark = 'highlightSecondary'
        else if (className === 'highlight-area') mark = 'highlightAreaBase'
        else if (className === 'button') mark = 'buttonBadge'
        out.push(...convertInline(node.children, [...activeMarks, mark], markDefs, warnings))
        break
      }
      case 'emphasis': {
        out.push(...convertInline(node.children, [...activeMarks, 'em'], markDefs, warnings))
        break
      }
      case 'link': {
        if (!node.url) {
          warnings.push(`Dropping link with empty href, text: "${mdastToString(node)}"`)
          out.push(...convertInline(node.children, activeMarks, markDefs, warnings))
          break
        }
        // `[[Text|doc]](url)` / `[[Text]](url)` button-link: the *rendered*
        // link text itself carries the `[...]` wrapper syntax (see
        // AncherLinkMarkdown.tsx — it regex-matches on `props.children`).
        const rawText = mdastToString(node)
        const buttonMatch = /^\[([^|]+)(?:\|(doc|link))?\]$/.exec(rawText)
        if (buttonMatch) {
          const markKey = key()
          markDefs.push({
            _type: 'buttonLink',
            _key: markKey,
            href: node.url,
            icon: buttonMatch[2] === 'doc' ? 'doc' : 'link',
          })
          out.push({ _type: 'span', _key: key(), text: buttonMatch[1], marks: [...activeMarks, markKey] })
          break
        }
        // Plain `[Text](url)` link.
        const markKey = key()
        markDefs.push({ _type: 'link', _key: markKey, href: node.url })
        out.push(...convertInline(node.children, [...activeMarks, markKey], markDefs, warnings))
        break
      }
      case 'paragraph': {
        // Inline spacer hack from customText (captureGap/captureNewline):
        // a `type: 'paragraph'` node used purely as an inline-position
        // marker, distinguished by data.hName === 'span'.
        const className = node.data?.hProperties?.className
        if (node.data?.hName === 'span' && (className === 'md-gap' || className === 'md-newline')) {
          out.push({ _type: 'spacer', _key: key(), kind: className === 'md-gap' ? 'gap' : 'newline' })
          break
        }
        warnings.push(`Unexpected inline paragraph node ignored: ${JSON.stringify(node)}`)
        break
      }
      default: {
        warnings.push(`Unhandled inline node type "${node.type}" ignored (text: "${mdastToString(node)}")`)
      }
    }
  }
  return out
}

// The old [center]/[left]/[right] markers are block-wide, but the schema
// can't attach a custom field to the native `block` type (see richContent.ts
// comment). Instead we apply an alignLeft/alignCenter/alignRight decorator
// to every span in the block; the renderer aligns the whole block based on
// the mark(s) present on its children.
function extractAlignMark(node) {
  const className = node.data?.hProperties?.className
  if (typeof className === 'string' && className.startsWith('md-align-')) {
    const dir = className.replace('md-align-', '')
    return `align${dir.charAt(0).toUpperCase()}${dir.slice(1)}`
  }
  return undefined
}

function applyAlignMark(children, alignMark) {
  if (!alignMark) return children
  for (const child of children) {
    if (child._type === 'span') child.marks.push(alignMark)
  }
  return children
}

function parseCalloutVariation(className) {
  const words = (className || '').split(/\s+/).filter(Boolean)
  if (words.includes('popup')) return { style: 'popup', color: words.includes('secondary') ? 'secondary' : 'base' }
  return {
    style: words.includes('highlight') ? 'highlight' : 'plain',
    color: words.includes('secondary') ? 'secondary' : 'base',
  }
}

// Converts a list of sibling mdast block-level nodes into Portable Text
// blocks/objects. `uploadImage(url)` is an async (url) => assetId resolver.
async function convertBlocks(nodes, uploadImage, warnings) {
  const blocks = []
  for (const node of nodes) {
    if (node.type === 'paragraph') {
      const imageMatch = extractImagesFromParagraph(node)
      if (imageMatch) {
        const images = []
        for (const img of imageMatch.images) {
          const assetId = await uploadImage(img.url)
          if (!assetId) continue
          images.push({
            _type: 'image',
            _key: key(),
            asset: { _type: 'reference', _ref: assetId },
            alt: img.alt,
            maxWidth: img.maxWidth,
            maxHeight: img.maxHeight,
          })
        }
        if (images.length > 0) {
          blocks.push({ _type: 'imageRow', _key: key(), images, align: imageMatch.align })
        }
        continue
      }
      const markDefs = []
      const children = applyAlignMark(convertInline(node.children, [], markDefs, warnings), extractAlignMark(node))
      if (children.length === 0) continue // drop now-empty paragraphs (e.g. a consumed [!variation] marker line)
      blocks.push({
        _type: 'block',
        _key: key(),
        style: 'normal',
        markDefs,
        children,
      })
      continue
    }
    if (node.type === 'heading') {
      const markDefs = []
      const children = applyAlignMark(convertInline(node.children, [], markDefs, warnings), extractAlignMark(node))
      if (children.length === 0) continue
      blocks.push({
        _type: 'block',
        _key: key(),
        style: `h${node.depth}`,
        markDefs,
        children,
      })
      continue
    }
    if (node.type === 'list') {
      for (const item of node.children) {
        // List items in real content are always a single paragraph; flatten
        // defensively in case of multi-paragraph items.
        for (const itemChild of item.children) {
          if (itemChild.type !== 'paragraph') continue
          const markDefs = []
          const children = convertInline(itemChild.children, [], markDefs, warnings)
          if (children.length === 0) continue
          blocks.push({
            _type: 'block',
            _key: key(),
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            markDefs,
            children,
          })
        }
      }
      continue
    }
    if (node.type === 'thematicBreak') {
      blocks.push({ _type: 'divider', _key: key(), kind: 'line' })
      continue
    }
    if (node.type === 'blockquote') {
      const { style, color } = parseCalloutVariation(node.data?.hProperties?.className)
      const body = await convertBlocks(node.children, uploadImage, warnings)
      if (body.length === 0) continue
      blocks.push({ _type: 'callout', _key: key(), style, color, body })
      continue
    }
    warnings.push(`Unhandled block node type "${node.type}" ignored (text: "${mdastToString(node)}")`)
  }
  return blocks
}

const processor = unified().use(remarkParse).use(remarkGfm).use(remarkBreaks)

async function convertMarkdownToPortableText(markdown, uploadImage, warnings) {
  const tree = processor.parse(markdown)
  applyCustomText(tree)
  applyCustomHighlightText(tree)
  applyCustomBlockquote(tree)
  return convertBlocks(tree.children, uploadImage, warnings)
}

// ---------------------------------------------------------------------------
// Step 6 — image upload with in-run caching (same URL used more than once
// should only be uploaded to Sanity's asset store once).
// ---------------------------------------------------------------------------
function makeImageUploader(client, dryRun) {
  const cache = new Map()
  return async function uploadImage(url) {
    if (cache.has(url)) return cache.get(url)
    if (dryRun) {
      const fakeId = `image-DRYRUN-${key()}`
      cache.set(url, fakeId)
      console.log(`  [dry-run] would fetch + upload image: ${url}`)
      return fakeId
    }
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`  ! failed to fetch image (${res.status}): ${url}`)
      return undefined
    }
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buffer = Buffer.from(await res.arrayBuffer())
    const asset = await client.assets.upload('image', buffer, { contentType })
    cache.set(url, asset._id)
    console.log(`  uploaded image asset ${asset._id} <- ${url}`)
    return asset._id
  }
}

// ---------------------------------------------------------------------------
// Step 7 — field discovery + patch
// ---------------------------------------------------------------------------
// `aboutPage` / `educationPage` are NOT standalone top-level documents —
// they're embedded inline inside the `portfolio` singleton's `pages` array
// (see schemas/portfolio/index.ts: `pages.of: [aboutPage, ..., educationPage, ...]`).
// A generic `*[_type == "aboutPage"]` query returns nothing; we have to fetch
// the singleton and filter its `pages` array by `_type`, then patch back
// through a `pages[_key=="..."]...` path using that array item's own `_key`.
async function fetchEmbeddedPortfolioPages(client, pageType) {
  const portfolio = await client.fetch(`*[_type == "portfolio"][0]{_id, pages}`)
  if (!portfolio) return []
  return (portfolio.pages || [])
    .filter((page) => page._type === pageType)
    .map((page) => ({ _id: portfolio._id, _pageKey: page._key, ...page }))
}

const FIELD_TARGETS = [
  {
    docType: 'aboutPage',
    fetchDocs: (client) => fetchEmbeddedPortfolioPages(client, 'aboutPage'),
    getValue: (doc) => doc.description,
    setPatch: (value, doc) => ({ [`pages[_key=="${doc._pageKey}"].description`]: value }),
  },
  {
    docType: 'educationPage',
    fetchDocs: (client) => fetchEmbeddedPortfolioPages(client, 'educationPage'),
    getValue: (doc) => doc.education?.description,
    setPatch: (value, doc) => ({ [`pages[_key=="${doc._pageKey}"].education.description`]: value }),
  },
  { docType: 'collegeCourses', getValue: (doc) => doc.description, setPatch: (value) => ({ description: value }) },
  { docType: 'internships', getValue: (doc) => doc.description, setPatch: (value) => ({ description: value }) },
  { docType: 'certificates', getValue: (doc) => doc.description, setPatch: (value) => ({ description: value }) },
  {
    docType: 'professionalExperience',
    getValue: (doc) => doc.description,
    setPatch: (value) => ({ description: value }),
  },
  { docType: 'projects', getValue: (doc) => doc.description, setPatch: (value) => ({ description: value }) },
]

async function run() {
  const client = getCliClient({ apiVersion: '2024-01-01' })
  const configuredDataset = client.config().dataset
  const dataset = TARGET_DATASET || configuredDataset
  if (dataset !== 'staging' && !ALLOW_PRODUCTION) {
    throw new Error(
      `Refusing to run against dataset "${dataset}". This script only runs against "staging" ` +
        `unless both --dataset=production and --i-am-sure are passed explicitly.`,
    )
  }
  const scopedClient = client.clone().config({ dataset })
  console.log(`Dataset: ${dataset}  |  Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'COMMIT (will patch documents)'}`)

  const uploadImage = makeImageUploader(scopedClient, DRY_RUN)
  let totalDocs = 0
  let totalConverted = 0
  const allWarnings = []

  for (const target of FIELD_TARGETS) {
    const docs = target.fetchDocs
      ? await target.fetchDocs(scopedClient)
      : await scopedClient.fetch(`*[_type == $type]`, { type: target.docType })
    for (const doc of docs) {
      const raw = target.getValue(doc)
      if (typeof raw !== 'string' || raw.trim() === '') continue
      totalDocs++
      const warnings = []
      let portableText
      try {
        portableText = await convertMarkdownToPortableText(raw, uploadImage, warnings)
      } catch (err) {
        console.error(`FAILED converting ${target.docType} ${doc._id}:`, err)
        continue
      }
      totalConverted++
      if (warnings.length > 0) {
        console.log(`\n${target.docType} ${doc._id} — ${warnings.length} warning(s):`)
        warnings.forEach((w) => console.log(`  ! ${w}`))
        allWarnings.push({ docType: target.docType, id: doc._id, warnings })
      }
      if (DRY_RUN) {
        console.log(`\n[dry-run] ${target.docType} ${doc._id} -> ${portableText.length} blocks`)
        console.log(JSON.stringify(portableText, null, 2))
      } else {
        await scopedClient.patch(doc._id).set(target.setPatch(portableText, doc)).commit()
        console.log(`patched ${target.docType} ${doc._id} (${portableText.length} blocks)`)
      }
    }
  }

  console.log(`\nDone. ${totalConverted}/${totalDocs} documents with content converted.`)
  if (allWarnings.length > 0) {
    console.log(`${allWarnings.length} document(s) produced warnings — review above before committing.`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
