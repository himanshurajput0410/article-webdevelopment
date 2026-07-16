import type { ApiBookmark } from '~/models/api/bookmark'
import type { Bookmark } from '~/models/domain/bookmark'

export function mapApiBookmarkToDomain(raw: ApiBookmark): Bookmark {
  return {
    id: raw.id,
    articleId: raw.articleId,
    note: raw.note?.trim() || '',
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt || raw.createdAt,
  }
}
