import type { BookmarkRepository, CreateBookmarkInput, UpdateBookmarkInput } from '~/models/domain/ports/BookmarkRepository'
import type { Bookmark } from '~/models/domain/bookmark'

export class FakeBookmarkRepository implements BookmarkRepository {
  bookmarks: Bookmark[] = []
  addError: Error | null = null
  updateError: Error | null = null
  removeError: Error | null = null

  async list(): Promise<Bookmark[]> {
    return this.bookmarks
  }

  async add(input: CreateBookmarkInput): Promise<Bookmark> {
    if (this.addError) throw this.addError

    const bookmark: Bookmark = {
      id: `saved-${this.bookmarks.length + 1}`,
      articleId: input.articleId,
      note: input.note,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }
    this.bookmarks = [...this.bookmarks, bookmark]
    return bookmark
  }

  async update(id: string, input: UpdateBookmarkInput): Promise<Bookmark> {
    if (this.updateError) throw this.updateError

    const existing = this.bookmarks.find((bookmark) => bookmark.id === id)
    if (!existing) throw new Error('not found')

    const updated: Bookmark = { ...existing, note: input.note }
    this.bookmarks = this.bookmarks.map((bookmark) => (bookmark.id === id ? updated : bookmark))
    return updated
  }

  async remove(id: string): Promise<void> {
    if (this.removeError) throw this.removeError
    this.bookmarks = this.bookmarks.filter((bookmark) => bookmark.id !== id)
  }
}
