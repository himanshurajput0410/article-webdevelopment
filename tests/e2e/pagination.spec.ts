import { test, expect } from '@playwright/test'
import { gotoAndHydrate } from './helpers'

test('loading more pages appends new articles without duplicating the ones already shown', async ({ page }) => {
  await gotoAndHydrate(page, '/')

  const articleLinks = () => page.locator('a[href^="/articles/"]')
  await expect(articleLinks().first()).toBeVisible()

  const initialCount = await articleLinks().count()
  expect(initialCount).toBeGreaterThan(0)

  const nextPageResponse = page.waitForResponse(
    (response) => response.url().includes('/api/articles') && response.url().includes('page=2'),
  )
  await page.getByRole('button', { name: 'Load More' }).click()
  await nextPageResponse

  await expect.poll(() => articleLinks().count()).toBeGreaterThan(initialCount)

  const hrefs = await articleLinks().evaluateAll((links) => links.map((link) => link.getAttribute('href')))
  expect(new Set(hrefs).size).toBe(hrefs.length)
})
