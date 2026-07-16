import type { ApiArticle } from '~/models/api/article'
import { hashToId } from '~/utils/id'
import rawArticles from '~/server/data/articles.json'

const articles = rawArticles as ApiArticle[]

export interface ArticleSearchOptions {
  query: string
  page: number
  pageSize: number
}

export interface ArticleSearchResult {
  articles: ApiArticle[]
  total: number
}

export function searchArticles({ query, page, pageSize }: ArticleSearchOptions): ArticleSearchResult {
  const term = query.trim().toLowerCase()
  const matches = term ? articles.filter((article) => (article.title ?? '').toLowerCase().includes(term)) : articles

  const start = (page - 1) * pageSize
  return {
    articles: matches.slice(start, start + pageSize),
    total: matches.length,
  }
}

export function findArticleById(id: string): ApiArticle | null {
  return articles.find((article) => hashToId(article.url) === id) ?? null
}
