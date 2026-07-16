import { describe, it, expect, vi } from 'vitest'
import { nitroRequest, type Fetcher, type NitroRequestOptions } from '~/infrastructure/http/nitroClient'
import { RepositoryError } from '~/models/domain/errors'

function createFetcher(impl: (url: string, options?: NitroRequestOptions) => unknown): Fetcher {
  return vi.fn(impl) as unknown as Fetcher
}

describe('nitroRequest', () => {
  it('resolves with the fetcher response on success', async () => {
    const fetcher = createFetcher(async () => ({ ok: true }))

    expect(await nitroRequest(fetcher, '/api/example')).toEqual({ ok: true })
  })

  it('prefers the response body message over statusMessage when both are present', async () => {
    const fetcher = createFetcher(async () => {
      throw { statusCode: 500, statusMessage: 'Internal Server Error', data: { message: 'Custom body message' } }
    })

    const rejection = nitroRequest(fetcher, '/api/example')
    await expect(rejection).rejects.toBeInstanceOf(RepositoryError)
    await expect(rejection).rejects.toMatchObject({ message: 'Custom body message' })
  })

  it('falls back to a generic message when the transport error has none', async () => {
    const fetcher = createFetcher(async () => {
      throw {}
    })

    await expect(nitroRequest(fetcher, '/api/example')).rejects.toMatchObject({
      message: 'Something went wrong. Please try again.',
    })
  })
})
