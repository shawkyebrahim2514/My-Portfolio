import studio from '@sanity/eslint-config-studio'

export default [
  {
    ignores: ['dist', '.sanity', 'node_modules'],
  },
  ...studio,
]
