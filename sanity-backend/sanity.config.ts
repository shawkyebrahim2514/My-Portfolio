import {defineConfig, isDev} from 'sanity'
import {visionTool} from '@sanity/vision'
import {structureTool} from 'sanity/structure'
import {IconManager} from 'sanity-plugin-icon-manager'
import {codeInput} from '@sanity/code-input'
import {colorInput} from '@sanity/color-input'
import {schemaTypes} from './schemas'
import {getStartedPlugin} from './plugins/sanity-plugin-tutorial'
import {singletonTypes, structure} from './structure'

const devOnlyPlugins = [getStartedPlugin()]

export default defineConfig({
  name: 'default',
  title: 'Portfolio',

  projectId: 'h48br789',
  // Override locally via SANITY_STUDIO_DATASET in a .env.local (gitignored)
  // to point Studio at a non-production dataset, e.g. a staging copy used
  // while developing/testing a schema migration.
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  auth: {
    loginMethod: 'token',
  },

  plugins: [
    structureTool({structure}),
    visionTool(),
    // Iconify-powered icon picker. `inlineSvg: true` stores the selected
    // icon's SVG markup directly on the document so the frontend can render
    // it with zero runtime lookups (works with static prerendering) and no
    // extra client-side icon library.
    IconManager({defaults: {inlineSvg: true, size: {width: 24, height: 24}}}),
    // Adds a `code` block type (used in richContent) with a language dropdown
    // and syntax-highlighted editing in Studio.
    codeInput(),
    // Adds a `color` field type (used by hubEntry.accent) with a hex picker.
    colorInput(),
    ...(isDev ? devOnlyPlugins : []),
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (prev, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? prev.filter(({action}) => action !== 'delete' && action !== 'duplicate')
        : prev,
  },
})
