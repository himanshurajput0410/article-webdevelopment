import type { Post } from '~/types/post'

export function usePosts() {
  return useApi<Post[]>('/posts')
}
