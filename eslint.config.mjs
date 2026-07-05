// eslint.config.mjs
// Production-grade ESLint Flat Config for Express + TypeScript Backend (July 2026)
//
// Rule philosophy:
//  - Type-aware linting (recommendedTypeChecked + stylisticTypeChecked) for backend safety
//  - Node.js global environment (not browser)
//  - No formatting rules — Prettier handles styling
//  - Strict build gates for console.log, unused code, and unhandled promises

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  // ─── Global Ignores ────────────────────────────────────────────────────────
  globalIgnores([
    'dist',
    'node_modules',
    'coverage',
    'build',
    '*.config.js',
    '*.config.mjs',
    'scripts/**',
  ]),

  // ─── Base JS Rules ────────────────────────────────────────────────────────
  js.configs.recommended,

  // ─── TypeScript: Type-Aware Rules ─────────────────────────────────────────
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // ─── Main Backend Source Rules ─────────────────────────────────────────────
  {
    files: ['**/*.ts'],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2023,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      // ── TypeScript ────────────────────────────────────────────────────────

      // Disallow explicit `any` — warn (pragmatic for backend requests/DTOs)
      '@typescript-eslint/no-explicit-any': 'warn',

      // Enforce type imports and exports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: true },
      ],

      // Async safety: promise must be handled or explicitly marked as floating
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      // No misused promises (checksVoidReturn: false avoids erroring on async Express middleware)
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],

      // Disallow redundant type assertions
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      // Non-null assertion warnings
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Unused variables rules: allow underscore prefix
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Prefer nullish coalescing and optional chaining
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignorePrimitives: { boolean: true } },
      ],
      '@typescript-eslint/prefer-optional-chain': 'error',

      // ── General Backend Quality ────────────────────────────────────────────

      // Block console.log in backend (use logger/console.info/console.error)
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
    },
  },

  // ─── Prettier Override (disables conflicting ESLint styling rules) ───────
  eslintConfigPrettier,
]);