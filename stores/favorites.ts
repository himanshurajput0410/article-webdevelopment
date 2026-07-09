export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    ids: [] as string[],
  }),
  getters: {
    isSaved(state) {
      return (id: string): boolean => state.ids.includes(id)
    },
  },
  actions: {
    toggle(id: string) {
      this.ids = this.ids.includes(id) ? this.ids.filter((existing) => existing !== id) : [...this.ids, id]
    },
    hydrate(ids: string[]) {
      this.ids = ids
    },
  },
})
