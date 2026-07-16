import type { BookmarkRepository, CreateBookmarkInput, UpdateBookmarkInput } from '~/models/domain/ports/BookmarkRepository'
import type { Bookmark } from '~/models/domain/bookmark'
import type { ApiBookmark } from '~/models/api/bookmark'
import { mapApiBookmarkToDomain } from '~/utils/bookmark'
import { nitroRequest, type Fetcher } from '~/infrastructure/http/nitroClient'

export class NitroBookmarkRepository implements BookmarkRepository {
  constructor(private readonly fetcher: Fetcher) {}

  async list(signal?: AbortSignal): Promise<Bookmark[]> {
    const response = await nitroRequest<ApiBookmark[]>(this.fetcher, '/api/bookmarks', { signal })
    return response.map(mapApiBookmarkToDomain)
  }

  async add(input: CreateBookmarkInput, signal?: AbortSignal): Promise<Bookmark> {
    const response = await nitroRequest<ApiBookmark>(this.fetcher, '/api/bookmarks', {
      method: 'POST',
      body: input,
      signal,
    })
    return mapApiBookmarkToDomain(response)
  }

  async update(id: string, input: UpdateBookmarkInput, signal?: AbortSignal): Promise<Bookmark> {
    const response = await nitroRequest<ApiBookmark>(this.fetcher, `/api/bookmarks/${id}`, {
      method: 'PUT',
      body: input,
      signal,
    })
    return mapApiBookmarkToDomain(response)
  }

  async remove(id: string, signal?: AbortSignal): Promise<void> {
    await nitroRequest<unknown>(this.fetcher, `/api/bookmarks/${id}`, { method: 'DELETE', signal })
  }
}
