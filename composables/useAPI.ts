import type { FetchError } from 'ofetch'
import type { ApiError } from '~/types/api'

function toApiError(error: FetchError | null): ApiError | null {
  if (!error) return null

  return {
    message: error.statusMessage || error.message || 'Something went wrong. Please try again.',
    statusCode: error.statusCode ?? null,
  }
}

// The only place in the app that calls useFetch directly, so every
// request comes back with the same error shape.
export async function useAPI<T>(url: string, options?: Parameters<typeof useFetch<T>>[1]) {
  const { data, pending, error, refresh } = await useFetch<T>(url, options)

  const apiError = computed(() => toApiError(error.value))

  return { data, pending, error: apiError, refresh }
}
