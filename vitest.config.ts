import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'node',
    hookTimeout: 60000,
    testTimeout: 60000,
    coverage: {
      provider: 'v8',
      include: ['utils/**', 'models/**', 'infrastructure/**', 'usecases/**'],
    },
  },
})
