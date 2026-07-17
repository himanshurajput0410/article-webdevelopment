import { test, expect } from '@playwright/test'
import { gotoAndHydrate, submitLoginForm } from './helpers'

const USER = { email: 'ada@example.com', password: 'password123' }

test('shows an error and stays on the page for invalid credentials', async ({ page }) => {
  await gotoAndHydrate(page, '/login')
  await submitLoginForm(page, USER.email, 'wrong-password')

  await expect(page.getByRole('alert')).toBeVisible({ timeout: 15000 })
  await expect(page).toHaveURL('/login')
})

test('redirects an unauthenticated visitor away from a protected page', async ({ page }) => {
  await gotoAndHydrate(page, '/bookmarks')
  await expect(page).toHaveURL(/\/login/)
})

test('logging out clears the session and protects the page again', async ({ page }) => {
  await gotoAndHydrate(page, '/login')
  await submitLoginForm(page, USER.email, USER.password)
  await expect(page).toHaveURL('/')

  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible()

  await gotoAndHydrate(page, '/bookmarks')
  await expect(page).toHaveURL(/\/login/)
})

test('refreshing a protected page after login keeps the session, with no flash of logged-out content', async ({ page }) => {
  await gotoAndHydrate(page, '/login')
  await submitLoginForm(page, USER.email, USER.password)
  await expect(page).toHaveURL('/')

  // A real navigation (not client-side routing) - the server must already
  // know we're authenticated on this very first response, or this would
  // redirect to /login or serve logged-out HTML before any client JS runs.
  const response = await page.goto('/bookmarks')
  expect(response?.status()).toBe(200)
  const html = (await response?.text()) ?? ''
  expect(html).toContain('Your bookmarks')
  expect(html).toContain('Ada Lovelace')

  await expect(page).toHaveURL('/bookmarks')
})
