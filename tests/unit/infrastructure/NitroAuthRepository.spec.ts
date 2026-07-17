import { describe, it, expect, vi } from 'vitest'
import { NitroAuthRepository } from '~/infrastructure/repositories/NitroAuthRepository'
import { UnauthorizedError, ValidationError } from '~/models/domain/errors'
import type { Fetcher, NitroRequestOptions } from '~/infrastructure/http/nitroClient'

function createFetcher(impl: (url: string, options?: NitroRequestOptions) => unknown): Fetcher {
  return vi.fn(impl) as unknown as Fetcher
}

describe('NitroAuthRepository.login', () => {
  it('POSTs credentials to /api/auth/login and maps the response to a User', async () => {
    const fetcher = createFetcher(async () => ({ id: 'u1', email: 'ada@example.com', name: 'Ada Lovelace' }))
    const repository = new NitroAuthRepository(fetcher)

    const user = await repository.login({ email: 'ada@example.com', password: 'password123' })

    expect(fetcher).toHaveBeenCalledWith(
      '/api/auth/login',
      expect.objectContaining({ method: 'POST', body: { email: 'ada@example.com', password: 'password123' } }),
    )
    expect(user).toEqual({ id: 'u1', email: 'ada@example.com', name: 'Ada Lovelace' })
  })

  it('translates invalid credentials into an UnauthorizedError', async () => {
    const fetcher = createFetcher(async () => {
      throw { statusCode: 401, statusMessage: 'Invalid email or password.' }
    })
    const repository = new NitroAuthRepository(fetcher)

    await expect(repository.login({ email: 'ada@example.com', password: 'wrong' })).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('translates a missing-field response into a ValidationError', async () => {
    const fetcher = createFetcher(async () => {
      throw { statusCode: 422, statusMessage: 'Email and password are required.' }
    })
    const repository = new NitroAuthRepository(fetcher)

    const rejection = repository.login({ email: '', password: '' })
    await expect(rejection).rejects.toBeInstanceOf(ValidationError)
    await expect(rejection).rejects.toMatchObject({ message: 'Email and password are required.' })
  })
})

describe('NitroAuthRepository.logout', () => {
  it('POSTs to /api/auth/logout', async () => {
    const fetcher = createFetcher(async () => ({ success: true }))
    const repository = new NitroAuthRepository(fetcher)

    await repository.logout()

    expect(fetcher).toHaveBeenCalledWith('/api/auth/logout', expect.objectContaining({ method: 'POST' }))
  })
})

describe('NitroAuthRepository.me', () => {
  it('returns the mapped user on success', async () => {
    const fetcher = createFetcher(async () => ({ id: 'u1', email: 'ada@example.com', name: 'Ada Lovelace' }))
    const repository = new NitroAuthRepository(fetcher)

    expect(await repository.me()).toEqual({ id: 'u1', email: 'ada@example.com', name: 'Ada Lovelace' })
  })

  it('returns null instead of throwing when unauthenticated', async () => {
    const fetcher = createFetcher(async () => {
      throw { statusCode: 401, statusMessage: 'Not authenticated.' }
    })
    const repository = new NitroAuthRepository(fetcher)

    expect(await repository.me()).toBeNull()
  })

  it('still throws for a non-401 error', async () => {
    const fetcher = createFetcher(async () => {
      throw { statusCode: 500, statusMessage: 'Internal Server Error' }
    })
    const repository = new NitroAuthRepository(fetcher)

    await expect(repository.me()).rejects.not.toBeInstanceOf(UnauthorizedError)
  })
})
