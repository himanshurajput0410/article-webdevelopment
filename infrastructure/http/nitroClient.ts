import { CancelledError, NotFoundError, RepositoryError, UnauthorizedError, ValidationError } from '~/models/domain/errors'

interface TransportError {
  statusCode?: number
  statusMessage?: string
  message?: string
  data?: { message?: string }
}

type NitroRequestOptions = Parameters<typeof $fetch>[1]

export async function nitroRequest<T>(url: string, options?: NitroRequestOptions): Promise<T> {
  try {
    const response = await $fetch<T>(url, options)
    return response as unknown as T
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
