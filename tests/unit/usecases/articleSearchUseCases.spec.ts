import { describe, it, expect } from 'vitest'
import { createArticleSearchUseCases } from '~/usecases/articleSearchUseCases'
import type { ArticleRepository, ArticleSearchParams } from '~/models/domain/ports/ArticleRepository'
import type { PaginatedResult } from '~/models/domain/pagination'
import type { Article } from '~/models/domain/article'
import { CancelledError } from '~/models/domain/errors'

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

  it('discards a slower superseded response even if it would resolve after the newer one', async () => {
    // The classic race: "first" takes longer than "second", so without
    // cancellation its result would land last and overwrite the newer one.
    const resolvedQueries: string[] = []
    const repository: ArticleRepository = {
      async search(params: ArticleSearchParams, signal?: AbortSignal): Promise<PaginatedResult<Article>> {
        const delayMs = params.query === 'first' ? 50 : 10
        await new Promise((resolve) => setTimeout(resolve, delayMs))
        if (signal?.aborted) throw new CancelledError()
        resolvedQueries.push(params.query)
        return { items: [], page: params.page, pageSize: params.pageSize ?? 10, total: 0, totalPages: 0 }
      },
      async getById(): Promise<Article | null> {
        return null
      },
    }
    const useCases = createArticleSearchUseCases(repository)

    const firstCall = useCases.search({ query: 'first', page: 1 }).catch((error: unknown) => error)
    const secondCall = useCases.search({ query: 'second', page: 1 })

    const [firstOutcome] = await Promise.all([firstCall, secondCall])

    expect(firstOutcome).toBeInstanceOf(CancelledError)
    expect(resolvedQueries).toEqual(['second'])
  })
})
