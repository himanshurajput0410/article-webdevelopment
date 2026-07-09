import type { Article } from '~/models/domain/article'

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: [] as Article[],
  }),
  getters: {
    getById(state) {
      return (id: string): Article | undefined => state.articles.find((article) => article.id === id)
    },
  },
  actions: {
    setArticles(articles: Article[]) {
      this.articles = articles
    },
  },
})
