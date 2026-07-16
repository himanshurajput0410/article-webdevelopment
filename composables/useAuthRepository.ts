import type { AuthRepository } from '~/models/domain/ports/AuthRepository'

export function useAuthRepository(): AuthRepository {
  return useNuxtApp().$authRepository
}
