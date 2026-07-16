import { describe, it, expect } from 'vitest'
import { hashToId } from '~/utils/id'

describe('hashToId', () => {
  it('returns the same id for the same input', () => {
    expect(hashToId('https://example.com/a')).toBe(hashToId('https://example.com/a'))
  })

  it('returns different ids for different inputs', () => {
    expect(hashToId('https://example.com/a')).not.toBe(hashToId('https://example.com/b'))
  })

  it('does not throw on an empty string', () => {
    expect(() => hashToId('')).not.toThrow()
  })
})
