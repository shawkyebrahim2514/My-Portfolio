import studio from '@sanity/eslint-config-studio'
import globals from 'globals'

export default [
  {
    ignores: ['dist', '.sanity', 'node_modules'],
  },
  ...studio,
  {
    // One-off Node.js tooling scripts (not part of the deployed Studio
    // bundle) — run via `sanity exec`, so they need Node globals rather
    // than the browser globals the rest of the Studio config assumes.
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
]
