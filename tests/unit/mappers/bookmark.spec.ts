import { describe, it, expect } from 'vitest'
import { mapApiBookmarkToDomain } from '~/utils/bookmark'
import type { ApiBookmark } from '~/models/api/bookmark'

describe('mapApiBookmarkToDomain', () => {
  it('maps every field to its domain counterpart', () => {
    const raw: ApiBookmark = {
      id: 'b1',
      articleId: 'a1',
      note: '  remember this  ',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    }

    expect(mapApiBookmarkToDomain(raw)).toEqual({
      id: 'b1',
      articleId: 'a1',
      note: 'remember this',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    })
  })

  it('round-trips the same output for the same input', () => {
    const raw: ApiBookmark = {
      id: 'b1',
      articleId: 'a1',
      note: 'note',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    }

    expect(mapApiBookmarkToDomain(raw)).toEqual(mapApiBookmarkToDomain(raw))
  })

  it('defaults a null note to an empty string', () => {
    const raw: ApiBookmark = {
      id: 'b2',
      articleId: 'a2',
      note: null,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: null,
    }

    expect(mapApiBookmarkToDomain(raw).note).toBe('')
  })

  it('defaults a missing updatedAt to createdAt', () => {
    const raw: ApiBookmark = {
      id: 'b3',
      articleId: 'a3',
      note: 'note',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: null,
    }

    expect(mapApiBookmarkToDomain(raw).updatedAt).toBe('2024-01-01T00:00:00Z')
  })
})
