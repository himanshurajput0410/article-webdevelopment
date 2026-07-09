import type { ApiArticle } from '~/models/api/article'
import type { Article } from '~/models/domain/article'
import { cleanArticleContent } from '~/utils/format'
import { hashToId } from '~/utils/id'

export function mapApiArticleToDomain(raw: ApiArticle): Article {
  return {
    id: hashToId(raw.url),
    title: raw.title?.trim() || 'Untitled article',
    description: raw.description?.trim() || null,
    content: cleanArticleContent(raw.content),
    author: raw.author?.trim() || null,
    sourceName: raw.source?.name?.trim() || null,
    imageUrl: raw.urlToImage || null,
    publishedAt: raw.publishedAt || null,
    sourceUrl: raw.url,
  }
}
