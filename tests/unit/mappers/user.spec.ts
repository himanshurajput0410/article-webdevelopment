import { describe, it, expect } from 'vitest'
import { mapApiUserToDomain } from '~/utils/user'

describe('mapApiUserToDomain', () => {
  it('maps id, email, and trimmed name', () => {
    expect(mapApiUserToDomain({ id: 'u1', email: 'a@example.com', name: '  Ada  ' })).toEqual({
      id: 'u1',
      email: 'a@example.com',
      name: 'Ada',
    })
  })

  it('falls back to the email when the name is null', () => {
    expect(mapApiUserToDomain({ id: 'u2', email: 'b@example.com', name: null }).name).toBe('b@example.com')
  })

  it('falls back to the email when the name is only whitespace', () => {
    expect(mapApiUserToDomain({ id: 'u3', email: 'c@example.com', name: '   ' }).name).toBe('c@example.com')
  })
})
