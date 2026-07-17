import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'node',
    hookTimeout: 60000,
    testTimeout: 60000,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{vite,vitest}.config.*',
      'tests/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      include: ['utils/**', 'models/**', 'infrastructure/**', 'usecases/**', 'server/utils/articles-data.ts'],
    },
  },
})
