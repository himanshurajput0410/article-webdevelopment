import type { BookmarkRepository, CreateBookmarkInput, UpdateBookmarkInput } from '~/models/domain/ports/BookmarkRepository'
import type { Bookmark } from '~/models/domain/bookmark'

export interface BookmarkStatePort {
  snapshot(): Bookmark[]
  restore(bookmarks: Bookmark[]): void
  upsert(bookmark: Bookmark): void
  removeById(id: string): void
}

export function createBookmarkUseCases(repository: BookmarkRepository, state: BookmarkStatePort) {
  return {
    async add(input: CreateBookmarkInput): Promise<Bookmark> {
      const snapshot = state.snapshot()
      const now = new Date().toISOString()
      const optimistic: Bookmark = {
        id: `optimistic:${crypto.randomUUID()}`,
        articleId: input.articleId,
        note: input.note,
        createdAt: now,
        updatedAt: now,
      }
      state.upsert(optimistic)

      try {
        const saved = await repository.add(input)
        state.removeById(optimistic.id)
        state.upsert(saved)
        return saved
      } catch (error) {
        state.restore(snapshot)
        throw error
      }
    },

    async update(id: string, input: UpdateBookmarkInput): Promise<Bookmark> {
      const snapshot = state.snapshot()
      const existing = snapshot.find((bookmark) => bookmark.id === id)
      if (existing) {
        state.upsert({ ...existing, note: input.note, updatedAt: new Date().toISOString() })
      }

      try {
        const saved = await repository.update(id, input)
        state.upsert(saved)
        return saved
      } catch (error) {
        state.restore(snapshot)
        throw error
      }
    },

    async remove(id: string): Promise<void> {
      const snapshot = state.snapshot()
      state.removeById(id)

      try {
        await repository.remove(id)
      } catch (error) {
        state.restore(snapshot)
        throw error
      }
    },
  }
}
