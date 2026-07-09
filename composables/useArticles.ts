import type { ApiArticle, ApiArticlesResponse } from '~/models/api/article'

// Fetches the feed and puts the mapped list in the store, so the detail
// page can reuse it instead of fetching again.
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

      // the feed can come back with articles missing, or without a url —
      // skip those instead of letting the app crash on a bad response
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
