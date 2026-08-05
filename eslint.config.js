import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/architecture/*/domain/**/*.{ts,tsx}', 'src/architecture/shared/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [
        { group: ['@/administration/application/**', '@/administration/infrastructure/**', '@/scheduling/application/**', '@/scheduling/infrastructure/**', '@/identity/application/**', '@/identity/infrastructure/**', '@/presentation/**'], message: 'Domain must remain framework and adapter independent.' },
        { group: ['react', 'axios'], message: 'Domain must not depend on UI or HTTP libraries.' },
      ] }],
    },
  },
  {
    files: ['src/architecture/*/application/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [
        { group: ['@/administration/infrastructure/**', '@/scheduling/infrastructure/**', '@/identity/infrastructure/**', '@/presentation/**'], message: 'Application may depend only on domain contracts, never on adapters or UI.' },
        { group: ['react', 'axios'], message: 'Application must be framework and HTTP-client independent.' },
      ] }],
    },
  },
  {
    files: ['src/architecture/administration/application/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { patterns: [{ group: ['@/scheduling/**', '@/identity/**', '@/administration/infrastructure/**', '@/presentation/**', 'react', 'axios'], message: 'Administration application must depend only on its domain and ports.' }] }] },
  },
  {
    files: ['src/architecture/scheduling/application/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { patterns: [{ group: ['@/administration/**', '@/identity/**', '@/scheduling/infrastructure/**', '@/presentation/**', 'react', 'axios'], message: 'Scheduling application must keep its own projections and depend only on ports.' }] }] },
  },
  {
    files: ['src/architecture/identity/application/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': ['error', { patterns: [{ group: ['@/administration/**', '@/scheduling/**', '@/identity/infrastructure/**', '@/presentation/**', 'react', 'axios'], message: 'Identity application is transversal and depends only on its ports.' }] }] },
  },
  {
    files: ['src/presentation/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [
        { group: ['@/architecture/**/infrastructure/**', '@/administration/infrastructure/**', '@/scheduling/infrastructure/**', '@/identity/infrastructure/**', '@/shared-architecture/http/**'], message: 'Presentation must receive application use cases instead of infrastructure adapters.' },
      ] }],
    },
  },
])
