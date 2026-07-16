import { NitroArticleRepository } from '~/infrastructure/repositories/NitroArticleRepository'
import { NitroBookmarkRepository } from '~/infrastructure/repositories/NitroBookmarkRepository'
import { NitroAuthRepository } from '~/infrastructure/repositories/NitroAuthRepository'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      articleRepository: new NitroArticleRepository(),
      bookmarkRepository: new NitroBookmarkRepository(),
      authRepository: new NitroAuthRepository(),
    },
  }
})
