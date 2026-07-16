import { describe, it, expect } from 'vitest'
import { createArticleSearchUseCases } from '~/usecases/articleSearchUseCases'
import type { ArticleRepository, ArticleSearchParams } from '~/models/domain/ports/ArticleRepository'
import type { PaginatedResult } from '~/models/domain/pagination'
import type { Article } from '~/models/domain/article'

function createFakeArticleRepository() {
  const signals: AbortSignal[] = []

  const repository: ArticleRepository = {
    async search(params: ArticleSearchParams, signal?: AbortSignal): Promise<PaginatedResult<Article>> {
      if (signal) signals.push(signal)
      return { items: [], page: params.page, pageSize: params.pageSize ?? 10, total: 0, totalPages: 0 }
    },
    async getById(): Promise<Article | null> {
      return null
    },
  }

  return { repository, signals }
}

describe('articleSearchUseCases.search', () => {
  it('aborts the previous in-flight search before starting a new one', async () => {
    const { repository, signals } = createFakeArticleRepository()
    const useCases = createArticleSearchUseCases(repository)

    const first = useCases.search({ query: 'a', page: 1 })
    const second = useCases.search({ query: 'ab', page: 1 })

    await Promise.all([first, second])

    expect(signals).toHaveLength(2)
    expect(signals[0]?.aborted).toBe(true)
    expect(signals[1]?.aborted).toBe(false)
  })

  it('does not abort the signal of a search that already completed', async () => {
    const { repository, signals } = createFakeArticleRepository()
    const useCases = createArticleSearchUseCases(repository)

    await useCases.search({ query: 'a', page: 1 })
    await useCases.search({ query: 'b', page: 1 })

    expect(signals[0]?.aborted).toBe(false)
    expect(signals[1]?.aborted).toBe(false)
  })
})
