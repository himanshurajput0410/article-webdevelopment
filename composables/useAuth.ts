import { createAuthUseCases } from '~/usecases/authUseCases'

export function useAuth() {
  const store = useAuthStore()
  const repository = useAuthRepository()
  const useCases = createAuthUseCases(repository, store)

  return {
    user: computed(() => store.user),
    isAuthenticated: computed(() => store.isAuthenticated),
    login: useCases.login,
    logout: useCases.logout,
  }
}
