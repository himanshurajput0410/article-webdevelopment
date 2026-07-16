import type { User } from '~/models/domain/user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),
  getters: {
    isAuthenticated(state) {
      return state.user !== null
    },
  },
  actions: {
    setUser(user: User | null) {
      this.user = user
    },
  },
})
