import type { ArticleRepository, ArticleSearchParams } from '~/models/domain/ports/ArticleRepository'
import type { Article } from '~/models/domain/article'
import type { PaginatedResult } from '~/models/domain/pagination'

export function createArticleSearchUseCases(repository: ArticleRepository) {
  let activeController: AbortController | null = null

  return {
    async search(params: ArticleSearchParams): Promise<PaginatedResult<Article>> {
      activeController?.abort()
      const controller = new AbortController()
      activeController = controller

      try {
        return await repository.search(params, controller.signal)
      } finally {
        if (activeController === controller) activeController = null
      }
    },
  }
}
