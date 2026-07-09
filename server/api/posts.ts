import type { Post } from '~/types/post'

const POSTS: Post[] = [
  { id: 1, title: 'Getting started with Nuxt 3', body: 'Nuxt 3 pairs Vue 3, Vite and Nitro into a single full-stack framework.' },
  { id: 2, title: 'Typed API composables', body: 'Wrapping useFetch in composables keeps components thin and typing consistent.' },
  { id: 3, title: 'State with Pinia', body: 'Pinia stores hold cross-component state without prop drilling.' },
]

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // simulate network latency so loading states are observable in development
  await new Promise((resolve) => setTimeout(resolve, 400))

  if (query.fail === 'true') {
    throw createError({ statusCode: 500, statusMessage: 'Failed to load posts' })
  }

  if (query.empty === 'true') {
    return [] as Post[]
  }

  return POSTS
})
