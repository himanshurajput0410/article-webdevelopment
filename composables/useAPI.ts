import type { FetchError } from 'ofetch'
import type { ApiError } from '~/types/api'

function toApiError(error: FetchError | null): ApiError | null {
  if (!error) return null

  return {
    message: error.statusMessage || error.message || 'Something went wrong. Please try again.',
    statusCode: error.statusCode ?? null,
  }
}

/**
 * Centralized entry point for all API communication. Wraps Nuxt's native
 * useFetch so every consumer gets the same typed response, the same
 * normalized error shape, and never talks to useFetch directly.
 */
export async function useAPI<T>(url: string, options?: Parameters<typeof useFetch<T>>[1]) {
  const { data, pending, error, refresh, status } = await useFetch<T>(url, options)

  const apiError = computed(() => toApiError(error.value))

  return { data, pending, error: apiError, refresh, status }
}
