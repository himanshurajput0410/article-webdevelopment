import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/e2e/global-setup.ts',
  fullyParallel: false,
  // all specs share one Nitro process and its in-memory sessions/bookmarks -
  // run them one at a time so tests can't interfere with each other
  workers: 1,
  retries: 0,
  reporter: 'list',
  // the first test to hit a not-yet-compiled route pays Nuxt dev's on-demand
  // compilation cost, which can exceed the default 30s
  timeout: 60000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    // a fully cold build (no .nuxt cache, e.g. a fresh clone or CI) can take
    // well over a minute
    timeout: 180000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
