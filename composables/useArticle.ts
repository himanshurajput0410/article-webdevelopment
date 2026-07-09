import type { Article } from '~/models/domain/article'

// Builds on useArticles so opening a detail page directly still works,
// and coming from the list doesn't trigger a second fetch.
export async function useArticle(id: string) {
  const store = useArticlesStore()
  const { pending, error, refresh } = await useArticles()

  const article = computed<Article | null>(() => store.getById(id) ?? null)

  return { article, pending, error, refresh }
}
