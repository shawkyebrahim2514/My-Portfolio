#!/usr/bin/env node
/**
 * One-off helper: sets `recommendedEntries` (ordered, curated references) on the
 * `software-engineering` hubCategory so the "You might also like" section on
 * that category's entry pages has something to render. Includes cross-category
 * picks on purpose to validate that behaviour.
 *
 * SAFETY: refuses to run unless the resolved client's dataset is exactly
 * "staging" (pass --dataset=production --i-am-sure to override).
 *
 * Usage (from sanity-backend/):
 *   npx sanity exec scripts/seed-recommended-entries.mjs --with-user-token
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

const CATEGORY_ID = 'hubCategory-software-engineering'
const RECOMMENDED_IDS = [
  'hubEntry-reading-developer-mindset', // software-engineering + career
  'hubEntry-podcast-essam-cafe', // software-engineering + career
  'hubEntry-channel-mataa3', // cross-category: faith + humanity
]

async function run() {
  const recommendedEntries = RECOMMENDED_IDS.map((id, i) => ({
    _type: 'reference',
    _key: `rec${i}`,
    _ref: id,
  }))

  await client.patch(CATEGORY_ID).set({ recommendedEntries }).commit()

  console.log(
    `Set recommendedEntries (${RECOMMENDED_IDS.length} entries) on ${CATEGORY_ID}.`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
