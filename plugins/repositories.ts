import { NitroArticleRepository } from '~/infrastructure/repositories/NitroArticleRepository'
import { NitroBookmarkRepository } from '~/infrastructure/repositories/NitroBookmarkRepository'
import { NitroAuthRepository } from '~/infrastructure/repositories/NitroAuthRepository'
import type { Fetcher } from '~/infrastructure/http/nitroClient'

// Cast the function bindings themselves, not their call results - Nuxt's
// typed-route inference for $fetch/useRequestFetch can hit TypeScript's
// recursion limit ("excessive stack depth") once enough dynamic API routes
// exist. Casting here means that machinery never gets engaged.
const requestFetch = useRequestFetch as unknown as () => Fetcher
const globalFetch = $fetch as unknown as Fetcher

export default defineNuxtPlugin(() => {
  // Internal SSR calls to our own /api/** routes don't carry the incoming
  // request's cookies unless we forward them explicitly - useRequestFetch
  // does that. On the client, the browser already sends cookies with $fetch.
  const fetcher = import.meta.server ? requestFetch() : globalFetch

  return {
    provide: {
      articleRepository: new NitroArticleRepository(fetcher),
      bookmarkRepository: new NitroBookmarkRepository(fetcher),
      authRepository: new NitroAuthRepository(fetcher),
    },
  }
})
