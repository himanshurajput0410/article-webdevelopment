import type { ApiError } from '~/types/api'
import { RepositoryError } from '~/models/domain/errors'

export function toApiError(error: unknown): ApiError {
  if (error instanceof RepositoryError) {
    return { message: error.message, statusCode: error.statusCode }
  }

  return { message: 'Something went wrong. Please try again.', statusCode: null }
}
