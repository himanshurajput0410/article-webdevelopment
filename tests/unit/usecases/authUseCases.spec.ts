import { describe, it, expect } from 'vitest'
import { createAuthUseCases, type AuthStatePort } from '~/usecases/authUseCases'
import type { AuthRepository, LoginInput } from '~/models/domain/ports/AuthRepository'
import type { User } from '~/models/domain/user'

function createFakeAuthRepository(overrides: Partial<AuthRepository> = {}): AuthRepository {
  return {
    async login(input: LoginInput): Promise<User> {
      return { id: 'u1', email: input.email, name: 'Test User' }
    },
    async logout(): Promise<void> {},
    async me(): Promise<User | null> {
      return null
    },
    ...overrides,
  }
}

function createFakeState() {
  let user: User | null = null
  const state: AuthStatePort = {
    setUser(next) {
      user = next
    },
  }
  return { state, getUser: () => user }
}

describe('authUseCases.login', () => {
  it('stores the returned user in state', async () => {
    const repository = createFakeAuthRepository()
    const { state, getUser } = createFakeState()
    const useCases = createAuthUseCases(repository, state)

    await useCases.login({ email: 'a@example.com', password: 'x' })

    expect(getUser()?.email).toBe('a@example.com')
  })

  it('propagates a repository rejection without setting state', async () => {
    const repository = createFakeAuthRepository({
      async login() {
        throw new Error('invalid credentials')
      },
    })
    const { state, getUser } = createFakeState()
    const useCases = createAuthUseCases(repository, state)

    await expect(useCases.login({ email: 'a@example.com', password: 'wrong' })).rejects.toThrow('invalid credentials')
    expect(getUser()).toBeNull()
  })
})

describe('authUseCases.logout', () => {
  it('clears the stored user', async () => {
    const repository = createFakeAuthRepository()
    const { state, getUser } = createFakeState()
    state.setUser({ id: 'u1', email: 'a@example.com', name: 'A' })
    const useCases = createAuthUseCases(repository, state)

    await useCases.logout()

    expect(getUser()).toBeNull()
  })
})
