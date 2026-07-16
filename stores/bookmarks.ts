import type { Bookmark } from '~/models/domain/bookmark'

export const useBookmarksStore = defineStore('bookmarks', {
  state: () => ({
    items: [] as Bookmark[],
  }),
  getters: {
    isBookmarked(state) {
      return (articleId: string): boolean => state.items.some((bookmark) => bookmark.articleId === articleId)
    },
    getByArticleId(state) {
      return (articleId: string): Bookmark | undefined => state.items.find((bookmark) => bookmark.articleId === articleId)
    },
  },
  actions: {
    setAll(items: Bookmark[]) {
      this.items = items
    },
    snapshot(): Bookmark[] {
      return this.items
    },
    restore(items: Bookmark[]) {
      this.items = items
    },
    upsert(bookmark: Bookmark) {
      const index = this.items.findIndex((item) => item.id === bookmark.id)
      this.items = index === -1 ? [...this.items, bookmark] : this.items.map((item, i) => (i === index ? bookmark : item))
    },
    removeById(id: string) {
      this.items = this.items.filter((item) => item.id !== id)
    },
  },
})
