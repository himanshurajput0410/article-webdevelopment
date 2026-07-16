import type { FetchOptions } from 'ofetch'
import { CancelledError, NotFoundError, RepositoryError, UnauthorizedError, ValidationError } from '~/models/domain/errors'

interface TransportError {
  statusCode?: number
  statusMessage?: string
  message?: string
  data?: { message?: string }
}

// Deliberately typed against plain string URLs + ofetch's own FetchOptions,
// not `typeof $fetch` - Nitro's typed-route inference for that global can hit
// TypeScript's recursion limit ("excessive stack depth") once enough dynamic
// API routes exist, and we only ever call these with plain runtime strings.
export type NitroRequestOptions = FetchOptions
export type Fetcher = <T = unknown>(url: string, options?: NitroRequestOptions) => Promise<T>

export async function nitroRequest<T>(fetcher: Fetcher, url: string, options?: NitroRequestOptions): Promise<T> {
  try {
    return await fetcher<T>(url, options)
  } catch (error) {
    if (options?.signal?.aborted) {
      throw new CancelledError()
    }

    const transportError = error as TransportError
    const statusCode = transportError.statusCode ?? null
    const message =
      transportError.data?.message || transportError.statusMessage || transportError.message || 'Something went wrong. Please try again.'

    if (statusCode === 404) throw new NotFoundError(message)
    if (statusCode === 401) throw new UnauthorizedError(message)
    if (statusCode === 422) throw new ValidationError(message)
    throw new RepositoryError(message, statusCode)
  }
}
