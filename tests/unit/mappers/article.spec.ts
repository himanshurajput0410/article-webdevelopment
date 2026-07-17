import { describe, it, expect } from 'vitest'
import { mapApiArticleToDomain } from '~/utils/article'
import type { ApiArticle } from '~/models/api/article'

const FULL_ARTICLE: ApiArticle = {
  source: { id: 'src-1', name: 'Example Source' },
  author: '  Jane Doe  ',
  title: '  Headline  ',
  description: '  Summary  ',
  url: 'https://example.com/article',
  urlToImage: 'https://example.com/image.jpg',
  publishedAt: '2024-01-01T00:00:00Z',
  content: 'Real content [+123 chars] filler',
}

describe('mapApiArticleToDomain', () => {
  it('maps every field to its domain counterpart, trimmed', () => {
    expect(mapApiArticleToDomain(FULL_ARTICLE)).toEqual({
      id: expect.any(String),
      title: 'Headline',
      description: 'Summary',
      content: 'Real content',
      author: 'Jane Doe',
      sourceName: 'Example Source',
      imageUrl: 'https://example.com/image.jpg',
      publishedAt: '2024-01-01T00:00:00Z',
      sourceUrl: 'https://example.com/article',
    })
  })

  it('round-trips to the same id for the same url', () => {
    const first = mapApiArticleToDomain(FULL_ARTICLE)
    const second = mapApiArticleToDomain(FULL_ARTICLE)
    expect(first.id).toBe(second.id)
  })

  it('falls back to sane defaults for a malformed, all-null payload', () => {
    const malformed: ApiArticle = {
      source: null,
      author: null,
      title: null,
      description: null,
      url: 'https://example.com/malformed',
      urlToImage: null,
      publishedAt: null,
      content: null,
    }

    expect(() => mapApiArticleToDomain(malformed)).not.toThrow()
    expect(mapApiArticleToDomain(malformed)).toEqual({
      id: expect.any(String),
      title: 'Untitled article',
      description: null,
      content: null,
      author: null,
      sourceName: null,
      imageUrl: null,
      publishedAt: null,
      sourceUrl: 'https://example.com/malformed',
    })
  })

  it('handles a payload with fields missing entirely, not just null', () => {
    // A real upstream bug or version mismatch might omit keys altogether
    // rather than sending explicit nulls - the mapper shouldn't assume they exist.
    const incomplete = { url: 'https://example.com/incomplete' } as unknown as ApiArticle

    expect(() => mapApiArticleToDomain(incomplete)).not.toThrow()
    const article = mapApiArticleToDomain(incomplete)
    expect(article.title).toBe('Untitled article')
    expect(article.author).toBeNull()
    expect(article.sourceName).toBeNull()
    expect(article.imageUrl).toBeNull()
  })

  it('never leaks the api shape onto the domain model', () => {
    const article = mapApiArticleToDomain(FULL_ARTICLE)
    expect(article).not.toHaveProperty('urlToImage')
    expect(article).not.toHaveProperty('source')
    expect(article).not.toHaveProperty('url')
  })
})
