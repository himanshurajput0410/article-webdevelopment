export interface ApiArticleSource {
  id: string | null
  name: string | null
}

export interface ApiArticle {
  source: ApiArticleSource | null
  author: string | null
  title: string | null
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string | null
  content: string | null
}

export interface ApiArticlesResponse {
  status: string
  totalResults: number
  articles: ApiArticle[]
}
