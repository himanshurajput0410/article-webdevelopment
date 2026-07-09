import type { ApiArticlesResponse } from '~/models/api/article'

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
      if (response) store.setArticles(response.articles.map(mapApiArticleToDomain))
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
