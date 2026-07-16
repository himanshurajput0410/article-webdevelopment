import type { AuthRepository, LoginInput } from '~/models/domain/ports/AuthRepository'
import type { User } from '~/models/domain/user'

export interface AuthStatePort {
  setUser(user: User | null): void
}

export function createAuthUseCases(repository: AuthRepository, state: AuthStatePort) {
  return {
    async login(input: LoginInput): Promise<User> {
      const user = await repository.login(input)
      state.setUser(user)
      return user
    },

    async logout(): Promise<void> {
      await repository.logout()
      state.setUser(null)
    },
  }
}
