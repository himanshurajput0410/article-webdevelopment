import { describe, it, expect, vi } from 'vitest'
import { NitroBookmarkRepository } from '~/infrastructure/repositories/NitroBookmarkRepository'
import { UnauthorizedError, ValidationError } from '~/models/domain/errors'
import type { Fetcher, NitroRequestOptions } from '~/infrastructure/http/nitroClient'

function createFetcher(impl: (url: string, options?: NitroRequestOptions) => unknown): Fetcher {
  return vi.fn(impl) as unknown as Fetcher
}

const RAW_BOOKMARK = {
  id: 'b1',
  articleId: 'a1',
  note: 'note',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

describe('NitroBookmarkRepository.list', () => {
  it('calls GET /api/bookmarks and maps each result', async () => {
    const fetcher = createFetcher(async () => [RAW_BOOKMARK])
    const repository = new NitroBookmarkRepository(fetcher)

    const bookmarks = await repository.list()

    expect(fetcher).toHaveBeenCalledWith('/api/bookmarks', expect.anything())
    expect(bookmarks).toHaveLength(1)
    expect(bookmarks[0]?.articleId).toBe('a1')
  })
})

describe('NitroBookmarkRepository.add', () => {
  it('POSTs to /api/bookmarks with the input as the body', async () => {
    const fetcher = createFetcher(async () => RAW_BOOKMARK)
    const repository = new NitroBookmarkRepository(fetcher)

    await repository.add({ articleId: 'a1', note: 'note' })

    expect(fetcher).toHaveBeenCalledWith(
      '/api/bookmarks',
      expect.objectContaining({ method: 'POST', body: { articleId: 'a1', note: 'note' } }),
    )
  })

  it('translates a 422 into a ValidationError', async () => {
    const fetcher = createFetcher(async () => {
      throw { statusCode: 422, statusMessage: 'Notes can be up to 500 characters.' }
    })
    const repository = new NitroBookmarkRepository(fetcher)

    await expect(repository.add({ articleId: 'a1', note: 'x'.repeat(600) })).rejects.toBeInstanceOf(ValidationError)
  })
})

describe('NitroBookmarkRepository.update', () => {
  it('PUTs to /api/bookmarks/:id with the input as the body', async () => {
    const fetcher = createFetcher(async () => RAW_BOOKMARK)
    const repository = new NitroBookmarkRepository(fetcher)

    await repository.update('b1', { note: 'updated' })

    expect(fetcher).toHaveBeenCalledWith(
      '/api/bookmarks/b1',
      expect.objectContaining({ method: 'PUT', body: { note: 'updated' } }),
    )
  })
})

describe('NitroBookmarkRepository.remove', () => {
  it('DELETEs /api/bookmarks/:id', async () => {
    const fetcher = createFetcher(async () => ({ success: true }))
    const repository = new NitroBookmarkRepository(fetcher)

    await repository.remove('b1')

    expect(fetcher).toHaveBeenCalledWith('/api/bookmarks/b1', expect.objectContaining({ method: 'DELETE' }))
  })

  it('translates a 401 into an UnauthorizedError', async () => {
    const fetcher = createFetcher(async () => {
      throw { statusCode: 401, statusMessage: 'You need to log in to do that.' }
    })
    const repository = new NitroBookmarkRepository(fetcher)

    await expect(repository.remove('b1')).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
