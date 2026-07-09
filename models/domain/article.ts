export interface Article {
  /** derived from the url — the API has no id of its own */
  id: string
  title: string
  description: string | null
  content: string | null
  author: string | null
  sourceName: string | null
  imageUrl: string | null
  publishedAt: string | null
  sourceUrl: string
}
