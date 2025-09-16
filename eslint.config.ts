import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  {
    ignores: [
      'dist',
      'node_modules',
      '.eslintrc.cjs',
      'public/mockServiceWorker.js',
      '.yarn/**',
      'coverage/**',
      '*.d.ts',
    ],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      // @ts-expect-error - Plugin type compatibility issues with current @typescript-eslint version
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['recommended-type-checked'].rules,
      ...reactHooks.configs.recommended.rules,

      // React specific rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true },
      ],

      // General code quality rules
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',

      // Import/export rules
      'no-duplicate-imports': 'error',
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
    },
  },
  {
    files: [
      '*.config.{ts,js}',
      'vite.config.ts',
      'jest.config.ts',
      'eslint.config.ts',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      // @ts-expect-error - Plugin type compatibility issues with current @typescript-eslint version
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      // Allow console in config files
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      'src/test/**/*.{ts,tsx}',
      'src/__tests__/**/*.{ts,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    rules: {
      // Relax some rules for test files
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      'no-console': 'off',

      // Test-specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|^(render|screen|fireEvent|waitFor|act)$',
        },
      ],
    },
  },
];

export default config;
