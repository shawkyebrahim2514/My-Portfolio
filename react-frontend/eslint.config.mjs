import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ['build', 'dist', 'node_modules', 'coverage'],
    },
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-refresh': reactRefresh,
            'react-hooks': reactHooks,
        },
        rules: {
            // Classic React Hooks rules (behavior preserved from the previous
            // eslint-plugin-react-hooks "recommended" set). The plugin's v7
            // "recommended" additionally enables the stricter React Compiler
            // rules, which are intentionally not adopted here.
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
    {
        // Route containers export `default ContainerWrap(X)`. The react-spring
        // HOC is not detectable by eslint-plugin-react-refresh, so the rule
        // false-positives here. Fast Refresh isn't relevant for these entry
        // components, so disable the rule for them only.
        files: ['src/containers/**/index.tsx'],
        rules: {
            'react-refresh/only-export-components': 'off',
        },
    },
    prettier
);
