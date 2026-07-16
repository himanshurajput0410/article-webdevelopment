import type { Bookmark } from '~/models/domain/bookmark'
import type { BookmarkStatePort } from '~/usecases/bookmarkUseCases'

export class FakeBookmarkState implements BookmarkStatePort {
  items: Bookmark[] = []

  snapshot(): Bookmark[] {
    return this.items
  }

  restore(items: Bookmark[]): void {
    this.items = items
  }

  upsert(bookmark: Bookmark): void {
    const index = this.items.findIndex((item) => item.id === bookmark.id)
    this.items = index === -1 ? [...this.items, bookmark] : this.items.map((item, i) => (i === index ? bookmark : item))
  }

  removeById(id: string): void {
    this.items = this.items.filter((item) => item.id !== id)
  }
}
