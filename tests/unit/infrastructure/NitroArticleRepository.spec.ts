import { describe, it, expect, vi } from 'vitest'
import { NitroArticleRepository } from '~/infrastructure/repositories/NitroArticleRepository'
import { NotFoundError, RepositoryError, CancelledError } from '~/models/domain/errors'
import type { Fetcher, NitroRequestOptions } from '~/infrastructure/http/nitroClient'

function createFetcher(impl: (url: string, options?: NitroRequestOptions) => unknown): Fetcher {
  return vi.fn(impl) as unknown as Fetcher
}

describe('NitroArticleRepository.search', () => {
  it('calls /api/articles with q, page, and pageSize in the query', async () => {
    const fetcher = createFetcher(async () => ({ articles: [], page: 2, pageSize: 10, total: 0, totalPages: 0 }))
    const repository = new NitroArticleRepository(fetcher)

    await repository.search({ query: 'bitcoin', page: 2, pageSize: 10 })

    expect(fetcher).toHaveBeenCalledWith(
      '/api/articles',
      expect.objectContaining({ query: { q: 'bitcoin', page: 2, pageSize: 10 } }),
    )
  })

  it('maps a successful response through the article mapper', async () => {
    const fetcher = createFetcher(async () => ({
      articles: [
        {
          source: null,
          author: null,
          title: 'Hello',
          description: null,
          url: 'https://example.com/x',
          urlToImage: null,
          publishedAt: null,
          content: null,
        },
      ],
      page: 1,
      pageSize: 10,
      total: 1,
      totalPages: 1,
    }))
    const repository = new NitroArticleRepository(fetcher)

    const result = await repository.search({ query: '', page: 1, pageSize: 10 })

    expect(result.items).toHaveLength(1)
    expect(result.items[0]?.title).toBe('Hello')
    expect(result.total).toBe(1)
  })

  it('translates a transport error into a domain RepositoryError, not the raw error', async () => {
    const fetcher = createFetcher(async () => {
      throw { statusCode: 500, statusMessage: 'Internal Server Error' }
    })
    const repository = new NitroArticleRepository(fetcher)

    const rejection = repository.search({ query: '', page: 1, pageSize: 10 })
    await expect(rejection).rejects.toBeInstanceOf(RepositoryError)
    await expect(rejection).rejects.not.toHaveProperty('statusMessage')
  })

  it('rejects as CancelledError when the signal was already aborted', async () => {
    const controller = new AbortController()
    controller.abort()

    const fetcher = createFetcher(async () => {
      const abortError = new DOMException('The operation was aborted.', 'AbortError')
      throw abortError
    })
    const repository = new NitroArticleRepository(fetcher)

    await expect(repository.search({ query: '', page: 1, pageSize: 10 }, controller.signal)).rejects.toBeInstanceOf(
      CancelledError,
    )
  })
})

describe('NitroArticleRepository.getById', () => {
  it('calls /api/articles/:id and maps the response', async () => {
    const fetcher = createFetcher(async () => ({
      source: null,
      author: null,
      title: 'Solo',
      description: null,
      url: 'https://example.com/solo',
      urlToImage: null,
      publishedAt: null,
      content: null,
    }))
    const repository = new NitroArticleRepository(fetcher)

    const article = await repository.getById('abc')

    expect(fetcher).toHaveBeenCalledWith('/api/articles/abc', expect.anything())
    expect(article?.title).toBe('Solo')
  })

  it('returns null instead of throwing when the article is not found', async () => {
    const fetcher = createFetcher(async () => {
      throw { statusCode: 404, statusMessage: 'Article not found.' }
    })
    const repository = new NitroArticleRepository(fetcher)

    expect(await repository.getById('missing')).toBeNull()
  })

  it('still throws for a non-404 error', async () => {
    const fetcher = createFetcher(async () => {
      throw { statusCode: 500 }
    })
    const repository = new NitroArticleRepository(fetcher)

    await expect(repository.getById('boom')).rejects.toBeInstanceOf(RepositoryError)
    await expect(repository.getById('boom')).rejects.not.toBeInstanceOf(NotFoundError)
  })
})
