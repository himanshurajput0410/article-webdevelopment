import type { Article } from '~/models/domain/article'
import type { ApiError } from '~/types/api'
import { createArticleSearchUseCases } from '~/usecases/articleSearchUseCases'
import { CancelledError } from '~/models/domain/errors'
import { toApiError } from '~/utils/error'

const PAGE_SIZE = 10

export async function useArticleSearch() {
  const repository = useArticleRepository()
  const useCases = createArticleSearchUseCases(repository)

  const query = useState('article-search-query', () => '')
  const page = useState('article-search-page', () => 1)
  const articles = useState<Article[]>('article-search-results', () => [])
  const total = useState('article-search-total', () => 0)
  const pending = ref(false)
  const error = ref<ApiError | null>(null)

  async function runSearch(reset: boolean) {
    pending.value = true
    error.value = null

    try {
      const result = await useCases.search({ query: query.value, page: page.value, pageSize: PAGE_SIZE })
      articles.value = reset ? result.items : [...articles.value, ...result.items]
      total.value = result.total
    } catch (caught) {
      if (caught instanceof CancelledError) return
      error.value = toApiError(caught)
    } finally {
      pending.value = false
    }
  }

  if (articles.value.length === 0) {
    await runSearch(true)
  }

  const debouncedSearch = debounce(() => {
    page.value = 1
    runSearch(true)
  }, 350)

  watch(query, debouncedSearch)

  const hasMore = computed(() => articles.value.length < total.value)

  function loadMore() {
    page.value += 1
    runSearch(false)
  }

  function retry() {
    runSearch(articles.value.length === 0)
  }

  return { articles, query, pending, error, hasMore, loadMore, retry }
}
