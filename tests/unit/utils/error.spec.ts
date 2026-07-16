import { describe, it, expect } from 'vitest'
import { toApiError } from '~/utils/error'
import { NotFoundError, ValidationError } from '~/models/domain/errors'

describe('toApiError', () => {
  it('maps a domain error to its message and statusCode', () => {
    expect(toApiError(new NotFoundError('missing'))).toEqual({ message: 'missing', statusCode: 404 })
  })

  it('maps a ValidationError to its statusCode', () => {
    expect(toApiError(new ValidationError('bad note'))).toEqual({ message: 'bad note', statusCode: 422 })
  })

  it('falls back to a generic message for a non-domain error', () => {
    expect(toApiError(new Error('boom'))).toEqual({ message: 'Something went wrong. Please try again.', statusCode: null })
  })

  it('falls back to a generic message for a thrown non-error value', () => {
    expect(toApiError('oops')).toEqual({ message: 'Something went wrong. Please try again.', statusCode: null })
  })
})
