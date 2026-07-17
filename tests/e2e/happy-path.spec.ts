import { test, expect } from '@playwright/test'
import { gotoAndHydrate } from './helpers'

const USER = { email: 'ada@example.com', password: 'password123' }

test('log in, search, bookmark an article, and see it in the collection', async ({ page }) => {
  await gotoAndHydrate(page, '/login')
  await page.locator('#email').fill(USER.email)
  await page.locator('#password').fill(USER.password)
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page).toHaveURL('/')

  await page.getByRole('button', { name: 'Search articles' }).click()

  const searchResponse = page.waitForResponse(
    (response) => response.url().includes('/api/articles') && response.url().includes('q=bitcoin'),
  )
  await page.getByLabel('Search articles by title').fill('bitcoin')
  await searchResponse

  const firstResult = page.locator('a[href^="/articles/"]').first()
  await expect(firstResult).toBeVisible()
  const articleTitle = (await firstResult.locator('h2').first().textContent())?.trim()
  if (!articleTitle) throw new Error('Expected the search result to have a title.')

  await firstResult.click()
  await expect(page).toHaveURL(/\/articles\//)

  const bookmarkButton = page.getByRole('button', { name: /bookmark/i })
  if ((await bookmarkButton.getAttribute('aria-label')) === 'Add bookmark') {
    await bookmarkButton.click()
    await expect(bookmarkButton).toHaveAttribute('aria-label', 'Remove bookmark')
  }

  await page.getByRole('link', { name: 'Bookmarks' }).click()
  await expect(page).toHaveURL('/bookmarks')

  await expect(page.getByText(articleTitle)).toBeVisible()
})
