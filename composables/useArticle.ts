import type { Article } from '~/models/domain/article'

/**
 * Looks up a single article by its route id. Reuses useArticles() so a
 * direct load of the detail page still fetches over SSR, while
 * navigating from the list reuses the already-cached store data.
 */
export async function useArticle(id: string) {
  const store = useArticlesStore()
  const { pending, error, refresh } = await useArticles()

  const article = computed<Article | null>(() => store.getById(id) ?? null)

  return { article, pending, error, refresh }
}
