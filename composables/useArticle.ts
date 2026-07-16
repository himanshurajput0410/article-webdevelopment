import type { Article } from '~/models/domain/article'
import type { ApiError } from '~/types/api'
import { toApiError } from '~/utils/error'

export async function useArticle(id: string) {
  const repository = useArticleRepository()

  const article = ref<Article | null>(null)
  const pending = ref(true)
  const error = ref<ApiError | null>(null)

  async function load() {
    pending.value = true
    error.value = null

    try {
      article.value = await repository.getById(id)
    } catch (caught) {
      error.value = toApiError(caught)
    } finally {
      pending.value = false
    }
  }

  await load()

  return { article, pending, error, refresh: load }
}
