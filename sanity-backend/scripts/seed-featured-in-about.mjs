#!/usr/bin/env node
/**
 * One-off helper: sets `featuredInAbout` (real Hub entries) on the
 * embedded `aboutPage` object inside the `portfolio` singleton, so the
 * About-page "See what I share" teaser points to public-ready content.
 *
 * SAFETY: refuses to run unless the resolved client's dataset is exactly
 * "staging" (pass --dataset=production --i-am-sure to override).
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/seed-featured-in-about.mjs --with-user-token
 */

import { getCliClient } from 'sanity/cli'

const scriptArgs = process.argv.slice(2)
const ALLOW_PRODUCTION = scriptArgs.includes('--i-am-sure')
const datasetFlag = scriptArgs.find((a) => a.startsWith('--dataset='))
const TARGET_DATASET = datasetFlag ? datasetFlag.split('=')[1] : undefined

const client = getCliClient({ apiVersion: '2023-01-01', dataset: TARGET_DATASET })

if (client.config().dataset !== 'staging' && !ALLOW_PRODUCTION) {
  console.error(
    `Refusing to run against dataset "${client.config().dataset}" — pass --dataset=staging explicitly, ` +
      `or --i-am-sure to override (not recommended).`,
  )
  process.exit(1)
}

const FEATURED_IDS = [
  'hubEntry-reading-developer-mindset',
  'hubEntry-podcast-essam-cafe',
  'hubEntry-channel-mataa3',
]

async function run() {
  const portfolio = await client.fetch(
    `*[_type == "portfolio"][0]{ _id, "aboutKey": pages[_type == "aboutPage"][0]._key }`,
  )
  if (!portfolio?.aboutKey) {
    console.error('Could not find an embedded aboutPage in the portfolio singleton.')
    process.exit(1)
  }

  const featuredInAbout = FEATURED_IDS.map((id, i) => ({
    _type: 'featuredHubEntry',
    _key: `feat${i}`,
    _ref: id,
  }))

  await client
    .patch(portfolio._id)
    .set({ [`pages[_key=="${portfolio.aboutKey}"].featuredInAbout`]: featuredInAbout })
    .commit()

  console.log(`Set featuredInAbout (${FEATURED_IDS.length} entries) on aboutPage (_key=${portfolio.aboutKey}).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
