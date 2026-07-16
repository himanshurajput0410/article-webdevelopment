import type { Bookmark } from '~/models/domain/bookmark'

export interface CreateBookmarkInput {
  articleId: string
  note: string
}

export interface UpdateBookmarkInput {
  note: string
}

export interface BookmarkRepository {
  list(signal?: AbortSignal): Promise<Bookmark[]>
  add(input: CreateBookmarkInput, signal?: AbortSignal): Promise<Bookmark>
  update(id: string, input: UpdateBookmarkInput, signal?: AbortSignal): Promise<Bookmark>
  remove(id: string, signal?: AbortSignal): Promise<void>
}
