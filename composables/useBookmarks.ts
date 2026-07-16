import type { ApiError } from '~/types/api'
import { createBookmarkUseCases } from '~/usecases/bookmarkUseCases'
import { validateNote } from '~/utils/validateNote'
import { ValidationError } from '~/models/domain/errors'
import { toApiError } from '~/utils/error'

export async function useBookmarks() {
  const store = useBookmarksStore()
  const repository = useBookmarkRepository()
  const { isAuthenticated } = useAuth()
  const useCases = createBookmarkUseCases(repository, store)

  const pending = ref(false)
  const error = ref<ApiError | null>(null)

  async function loadAll() {
    if (!isAuthenticated.value) return
    pending.value = true
    error.value = null

    try {
      store.setAll(await repository.list())
    } catch (caught) {
      error.value = toApiError(caught)
    } finally {
      pending.value = false
    }
  }

  if (isAuthenticated.value && store.items.length === 0) {
    await loadAll()
  }

  async function addBookmark(articleId: string, rawNote = '') {
    const validated = validateNote(rawNote)
    if (!validated.valid) throw new ValidationError(validated.message)
    return useCases.add({ articleId, note: validated.value })
  }

  async function updateNote(id: string, rawNote: string) {
    const validated = validateNote(rawNote)
    if (!validated.valid) throw new ValidationError(validated.message)
    return useCases.update(id, { note: validated.value })
  }

  async function removeBookmark(id: string) {
    return useCases.remove(id)
  }

  return {
    bookmarks: computed(() => store.items),
    isBookmarked: (articleId: string) => store.isBookmarked(articleId),
    getByArticleId: (articleId: string) => store.getByArticleId(articleId),
    pending,
    error,
    refresh: loadAll,
    addBookmark,
    updateNote,
    removeBookmark,
  }
}
