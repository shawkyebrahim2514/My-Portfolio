import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/', '.astro/', 'node_modules/', '*.config.mjs'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Astro components
  ...astro.configs['flat/recommended'],

  // React islands (.tsx/.jsx): a11y + hooks rules
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
    },
  },

  // Node scripts (build/migration tooling)
  {
    files: ['scripts/**/*.{js,mjs}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
);
