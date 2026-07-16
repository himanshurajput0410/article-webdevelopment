import { NitroArticleRepository } from '~/infrastructure/repositories/NitroArticleRepository'
import { NitroBookmarkRepository } from '~/infrastructure/repositories/NitroBookmarkRepository'
import { NitroAuthRepository } from '~/infrastructure/repositories/NitroAuthRepository'
import type { Fetcher } from '~/infrastructure/http/nitroClient'

export default defineNuxtPlugin(() => {
  // Internal SSR calls to our own /api/** routes don't carry the incoming
  // request's cookies unless we forward them explicitly - useRequestFetch
  // does that. On the client, the browser already sends cookies with $fetch.
  const fetcher = (import.meta.server ? useRequestFetch() : $fetch) as Fetcher

  return {
    provide: {
      articleRepository: new NitroArticleRepository(fetcher),
      bookmarkRepository: new NitroBookmarkRepository(fetcher),
      authRepository: new NitroAuthRepository(fetcher),
    },
  }
})
