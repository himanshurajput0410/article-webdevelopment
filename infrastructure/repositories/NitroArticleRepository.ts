import type { ArticleRepository, ArticleSearchParams } from '~/models/domain/ports/ArticleRepository'
import type { Article } from '~/models/domain/article'
import type { PaginatedResult } from '~/models/domain/pagination'
import type { ApiArticle } from '~/models/api/article'
import { mapApiArticleToDomain } from '~/utils/article'
import { nitroRequest, type Fetcher } from '~/infrastructure/http/nitroClient'
import { NotFoundError } from '~/models/domain/errors'

interface ApiArticlesPage {
  articles: ApiArticle[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export class NitroArticleRepository implements ArticleRepository {
  constructor(private readonly fetcher: Fetcher) {}

  async search(params: ArticleSearchParams, signal?: AbortSignal): Promise<PaginatedResult<Article>> {
    const response = await nitroRequest<ApiArticlesPage>(this.fetcher, '/api/articles', {
      query: { q: params.query, page: params.page, pageSize: params.pageSize },
      signal,
    })

    return {
      items: response.articles.map(mapApiArticleToDomain),
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
      totalPages: response.totalPages,
    }
  }

  async getById(id: string, signal?: AbortSignal): Promise<Article | null> {
    try {
      const article = await nitroRequest<ApiArticle>(this.fetcher, `/api/articles/${id}`, { signal })
      return mapApiArticleToDomain(article)
    } catch (error) {
      if (error instanceof NotFoundError) return null
      throw error
    }
  }
}
