import type { Page } from '@playwright/test'

// Nuxt dev mode compiles routes on demand, and 'networkidle' never resolves
// reliably against it (Vite's HMR websocket stays open indefinitely), so we
// wait for the page to load, then give Vue a brief moment to finish
// hydrating and attach its event listeners before interacting with it.
export async function gotoAndHydrate(page: Page, url: string) {
  await page.goto(url)
  await page.waitForTimeout(300)
}

// If Vue hasn't attached its @submit.prevent handler yet (still possible on
// a slow/cold dev server even after the wait above), clicking the submit
// button falls through to a native browser form submission - a real
// navigation back to /login with an empty query string that silently
// discards the attempt and resets the fields. Detect that specific
// signature (still on /login, email field now empty) and retry, rather
// than guessing an ever-larger fixed delay.
export async function submitLoginForm(page: Page, email: string, password: string) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    await page.locator('#email').fill(email)
    await page.locator('#password').fill(password)
    await page.getByRole('button', { name: 'Log in' }).click()
    await page.waitForTimeout(400)

    const emailValue = await page.locator('#email').inputValue().catch(() => '')
    const stillOnBareLoginPage = page.url().replace(/\?$/, '').endsWith('/login')
    const nativeSubmitHappened = stillOnBareLoginPage && emailValue === ''

    if (!nativeSubmitHappened) return
  }
}
