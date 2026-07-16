export interface StoredBookmark {
  id: string
  userId: string
  articleId: string
  note: string
  createdAt: string
  updatedAt: string
}

// Resets whenever the Nitro dev server restarts, same as sessions.
const bookmarksByUser = new Map<string, StoredBookmark[]>()

export function listBookmarks(userId: string): StoredBookmark[] {
  return bookmarksByUser.get(userId) ?? []
}

export function findBookmark(userId: string, bookmarkId: string): StoredBookmark | null {
  return listBookmarks(userId).find((bookmark) => bookmark.id === bookmarkId) ?? null
}

export function findBookmarkByArticle(userId: string, articleId: string): StoredBookmark | null {
  return listBookmarks(userId).find((bookmark) => bookmark.articleId === articleId) ?? null
}

export function createBookmark(userId: string, articleId: string, note: string): StoredBookmark {
  const existing = findBookmarkByArticle(userId, articleId)
  if (existing) return existing

  const now = new Date().toISOString()
  const bookmark: StoredBookmark = {
    id: crypto.randomUUID(),
    userId,
    articleId,
    note,
    createdAt: now,
    updatedAt: now,
  }

  bookmarksByUser.set(userId, [...listBookmarks(userId), bookmark])
  return bookmark
}

export function updateBookmarkNote(userId: string, bookmarkId: string, note: string): StoredBookmark | null {
  const bookmarks = listBookmarks(userId)
  const existing = bookmarks.find((bookmark) => bookmark.id === bookmarkId)
  if (!existing) return null

  const updated: StoredBookmark = { ...existing, note, updatedAt: new Date().toISOString() }
  bookmarksByUser.set(userId, bookmarks.map((bookmark) => (bookmark.id === bookmarkId ? updated : bookmark)))
  return updated
}

export function removeBookmark(userId: string, bookmarkId: string): boolean {
  const bookmarks = listBookmarks(userId)
  const next = bookmarks.filter((bookmark) => bookmark.id !== bookmarkId)
  bookmarksByUser.set(userId, next)
  return next.length !== bookmarks.length
}

export interface PublicBookmark {
  id: string
  articleId: string
  note: string
  createdAt: string
  updatedAt: string
}

export function toPublicBookmark(bookmark: StoredBookmark): PublicBookmark {
  return {
    id: bookmark.id,
    articleId: bookmark.articleId,
    note: bookmark.note,
    createdAt: bookmark.createdAt,
    updatedAt: bookmark.updatedAt,
  }
}
