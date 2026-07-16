import type { Article } from '~/models/domain/article'
import type { PaginatedResult } from '~/models/domain/pagination'

export interface ArticleSearchParams {
  query: string
  page: number
  pageSize?: number
}

export interface ArticleRepository {
  search(params: ArticleSearchParams, signal?: AbortSignal): Promise<PaginatedResult<Article>>
  getById(id: string, signal?: AbortSignal): Promise<Article | null>
}
