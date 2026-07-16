import type { AuthRepository, LoginInput } from '~/models/domain/ports/AuthRepository'
import type { User } from '~/models/domain/user'
import type { ApiUser } from '~/models/api/auth'
import { mapApiUserToDomain } from '~/utils/user'
import { nitroRequest, type Fetcher } from '~/infrastructure/http/nitroClient'
import { UnauthorizedError } from '~/models/domain/errors'

export class NitroAuthRepository implements AuthRepository {
  constructor(private readonly fetcher: Fetcher) {}

  async login(input: LoginInput): Promise<User> {
    const response = await nitroRequest<ApiUser>(this.fetcher, '/api/auth/login', {
      method: 'POST',
      body: input,
    })
    return mapApiUserToDomain(response)
  }

  async logout(): Promise<void> {
    await nitroRequest<unknown>(this.fetcher, '/api/auth/logout', { method: 'POST' })
  }

  async me(): Promise<User | null> {
    try {
      const response = await nitroRequest<ApiUser>(this.fetcher, '/api/auth/me')
      return mapApiUserToDomain(response)
    } catch (error) {
      if (error instanceof UnauthorizedError) return null
      throw error
    }
  }
}
