export interface Article {
  /** Stable, URL-derived identifier used for routing (the API has no numeric id). */
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
