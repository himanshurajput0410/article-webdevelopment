import { describe, it, expect } from 'vitest'
import { searchArticles, findArticleById } from '~/server/utils/articles-data'
import { hashToId } from '~/utils/id'
import type { ApiArticle } from '~/models/api/article'
import rawArticlesJson from '~/server/data/articles.json'

const rawArticles = rawArticlesJson as ApiArticle[]

describe('searchArticles pagination', () => {
  it('returns a full page of results from the first page', () => {
    const result = searchArticles({ query: '', page: 1, pageSize: 10 })

    expect(result.articles).toHaveLength(10)
    expect(result.total).toBe(rawArticles.length)
  })

  it('returns the remaining partial page for the last page', () => {
    const pageSize = 10
    const lastPage = Math.ceil(rawArticles.length / pageSize)
    const result = searchArticles({ query: '', page: lastPage, pageSize })
    const expectedRemainder = rawArticles.length % pageSize || pageSize

    expect(result.articles).toHaveLength(expectedRemainder)
  })

  it('returns an empty array, not an error, for a page past the last one', () => {
    const pageSize = 10
    const beyondLastPage = Math.ceil(rawArticles.length / pageSize) + 5
    const result = searchArticles({ query: '', page: beyondLastPage, pageSize })

    expect(result.articles).toEqual([])
    expect(result.total).toBe(rawArticles.length)
  })

  it('does not repeat articles across consecutive pages', () => {
    const pageOne = searchArticles({ query: '', page: 1, pageSize: 10 })
    const pageTwo = searchArticles({ query: '', page: 2, pageSize: 10 })
    const pageOneUrls = new Set(pageOne.articles.map((article) => article.url))
    const overlap = pageTwo.articles.filter((article) => pageOneUrls.has(article.url))

    expect(overlap).toHaveLength(0)
  })

  it('keeps the same total across every page of a search query', () => {
    const pageOne = searchArticles({ query: 'bitcoin', page: 1, pageSize: 2 })
    const pageTwo = searchArticles({ query: 'bitcoin', page: 2, pageSize: 2 })

    expect(pageOne.total).toBeGreaterThan(0)
    expect(pageTwo.total).toBe(pageOne.total)
  })

  it('matches titles case-insensitively', () => {
    const lower = searchArticles({ query: 'bitcoin', page: 1, pageSize: 50 })
    const upper = searchArticles({ query: 'BITCOIN', page: 1, pageSize: 50 })

    expect(upper.total).toBeGreaterThan(0)
    expect(upper.total).toBe(lower.total)
  })

  it('returns no matches for a query that does not appear anywhere', () => {
    const result = searchArticles({ query: 'zzzzznonexistentqueryzzzz', page: 1, pageSize: 10 })

    expect(result.articles).toEqual([])
    expect(result.total).toBe(0)
  })
})

describe('findArticleById', () => {
  it('finds an article by its derived id', () => {
    const target = rawArticles[0]
    if (!target) throw new Error('expected at least one seeded article')

    const found = findArticleById(hashToId(target.url))
    expect(found?.url).toBe(target.url)
  })

  it('returns null for an id that does not exist', () => {
    expect(findArticleById('this-id-does-not-exist')).toBeNull()
  })
})
