import type { ArticleRepository } from '~/models/domain/ports/ArticleRepository'

export function useArticleRepository(): ArticleRepository {
  return useNuxtApp().$articleRepository
}
