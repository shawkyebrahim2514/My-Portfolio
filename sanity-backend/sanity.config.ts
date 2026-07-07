import {defineConfig, isDev} from 'sanity'
import {visionTool} from '@sanity/vision'
import {structureTool} from 'sanity/structure'
import {IconManager} from 'sanity-plugin-icon-manager'
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

  plugins: [
    structureTool(),
    visionTool(),
    // Iconify-powered icon picker. `inlineSvg: true` stores the selected
    // icon's SVG markup directly on the document so the frontend can render
    // it with zero runtime lookups (works with static prerendering) and no
    // extra client-side icon library.
    IconManager({defaults: {inlineSvg: true, size: {width: 24, height: 24}}}),
    ...(isDev ? devOnlyPlugins : []),
  ],

  schema: {
    types: schemaTypes,
  },
})

