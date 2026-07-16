import type { BookmarkRepository } from '~/models/domain/ports/BookmarkRepository'

export function useBookmarkRepository(): BookmarkRepository {
  return useNuxtApp().$bookmarkRepository
}
