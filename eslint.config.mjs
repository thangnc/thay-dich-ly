import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: ['node_modules/**', 'out/**', 'dist/**', '*.tsbuildinfo']
  },

  // ─── Main + Preload (Node / Electron) ────────────────────────────────────
  {
    files: ['src/main/**/*.ts', 'src/preload/**/*.ts', 'electron.vite.config.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.node.json',
        tsconfigRootDir: import.meta.dirname
      },
      globals: { process: 'readonly', __dirname: 'readonly' }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  },

  // ─── Renderer (React + TypeScript) ───────────────────────────────────────
  {
    ...reactPlugin.configs.flat.recommended,
    files: ['src/renderer/src/**/*.{ts,tsx}'],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      parser: tsParser
    },
    plugins: {
      ...reactPlugin.configs.flat.recommended.plugins,
      '@typescript-eslint': tsPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...tsPlugin.configs['recommended'].rules,
      ...reactHooksPlugin.configs['recommended'].rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'warn',
      'react/react-in-jsx-scope': 'off',       // not needed with React 17+ JSX transform
      'react/prop-types': 'off',               // TypeScript handles this
      'react/no-unescaped-entities': 'off',    // Vietnamese text uses " quotes intentionally
      'no-use-before-define': 'off',           // function declarations are hoisted
      '@typescript-eslint/no-use-before-define': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  },

  // ─── Per-file overrides ───────────────────────────────────────────────────
  // useApp.ts uses hoisted function declarations (loadSessions called before declaration)
  // which is valid JS but causes an internal exception in eslint-plugin-react-hooks.
  {
    files: ['src/renderer/src/hooks/useApp.ts'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off'
    }
  }
]
