import {defineConfig, isDev} from 'sanity'
import {visionTool} from '@sanity/vision'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import {getStartedPlugin} from './plugins/sanity-plugin-tutorial'

const devOnlyPlugins = [getStartedPlugin()]

export default defineConfig({
  name: 'default',
  title: 'Portfolio',

  projectId: 'h48br789',
  // Override locally via SANITY_STUDIO_DATASET in a .env.local (gitignored)
  // to point Studio at a non-production dataset, e.g. a staging copy used
  // while developing/testing a schema migration.
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool(), visionTool(), ...(isDev ? devOnlyPlugins : [])],

  schema: {
    types: schemaTypes,
  },
})

