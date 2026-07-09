import type { ApiArticle, ApiArticlesResponse } from '~/models/api/article'

/**
 * Fetches the article feed (SSR-friendly) and caches the mapped domain
 * list in the Pinia store, so the detail view can reuse it instead of
 * issuing a second request.
 */
export async function useArticles() {
  const config = useRuntimeConfig()
  const store = useArticlesStore()

  const { data, pending, error, refresh } = await useAPI<ApiArticlesResponse>(config.public.articlesApiUrl, {
    key: 'articles-list',
  })

  watch(
    data,
    (response) => {
      if (!response) return

      // Defend against a malformed/unexpected response shape (missing
      // `articles`, or entries with no `url`, which every domain
      // article needs for routing and the external link) so a bad
      // payload degrades to an empty list instead of throwing.
      const rawArticles = Array.isArray(response.articles) ? response.articles : []
      const validArticles = rawArticles.filter((item): item is ApiArticle => Boolean(item?.url))

      store.setArticles(validArticles.map(mapApiArticleToDomain))
    },
    { immediate: true },
  )

  return {
    articles: computed(() => store.articles),
    pending,
    error,
    refresh,
  }
}
