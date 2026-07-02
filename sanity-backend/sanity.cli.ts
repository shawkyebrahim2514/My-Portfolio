import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'h48br789',
    // Same override as sanity.config.ts — keep the CLI targeting the same
    // dataset as Studio when SANITY_STUDIO_DATASET is set locally.
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  }
})
