import type { Page } from '@playwright/test'

// Nuxt dev mode compiles routes on demand, and 'networkidle' never resolves
// reliably against it (Vite's HMR websocket stays open indefinitely), so we
// wait for the page to load, then give Vue a brief moment to finish
// hydrating and attach its event listeners before interacting with it.
export async function gotoAndHydrate(page: Page, url: string) {
  await page.goto(url)
  await page.waitForTimeout(300)
}
