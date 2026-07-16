import type { User } from '~/models/domain/user'

declare module 'h3' {
  interface H3EventContext {
    auth: {
      user: User | null
    }
  }
}

export {}
