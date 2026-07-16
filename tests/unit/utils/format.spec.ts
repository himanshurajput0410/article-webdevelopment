import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatPublishedDate, formatRelativeTime, cleanArticleContent } from '~/utils/format'

describe('formatPublishedDate', () => {
  it('returns a fallback for null', () => {
    expect(formatPublishedDate(null)).toBe('Date unknown')
  })

  it('returns a fallback for an invalid date string', () => {
    expect(formatPublishedDate('not-a-date')).toBe('Date unknown')
  })

  it('formats a valid ISO date', () => {
    expect(formatPublishedDate('2024-01-01T00:00:00Z')).not.toBe('Date unknown')
  })
})

describe('formatRelativeTime', () => {
  const NOW = new Date('2024-01-10T12:00:00.000Z')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function isoOffset(ms: number): string {
    return new Date(NOW.getTime() - ms).toISOString()
  }

  it('returns a fallback for null', () => {
    expect(formatRelativeTime(null)).toBe('Date unknown')
  })

  it('returns a fallback for an invalid date string', () => {
    expect(formatRelativeTime('not-a-date')).toBe('Date unknown')
  })

  it('says "Just now" for under a minute', () => {
    expect(formatRelativeTime(isoOffset(30 * 1000))).toBe('Just now')
  })

  it('formats minutes ago, at the boundary just under an hour', () => {
    expect(formatRelativeTime(isoOffset(5 * 60 * 1000))).toBe('5m ago')
    expect(formatRelativeTime(isoOffset(59 * 60 * 1000))).toBe('59m ago')
  })

  it('formats hours ago, at the boundary just under a day', () => {
    expect(formatRelativeTime(isoOffset(3 * 60 * 60 * 1000))).toBe('3h ago')
    expect(formatRelativeTime(isoOffset(23 * 60 * 60 * 1000))).toBe('23h ago')
  })

  it('formats days ago, at the boundary just under a week', () => {
    expect(formatRelativeTime(isoOffset(2 * 24 * 60 * 60 * 1000))).toBe('2d ago')
    expect(formatRelativeTime(isoOffset(6 * 24 * 60 * 60 * 1000))).toBe('6d ago')
  })

  it('falls back to a real date once a week or older', () => {
    expect(formatRelativeTime(isoOffset(7 * 24 * 60 * 60 * 1000))).not.toMatch(/ago$/)
    expect(formatRelativeTime(isoOffset(10 * 24 * 60 * 60 * 1000))).not.toMatch(/ago$/)
  })
})

describe('cleanArticleContent', () => {
  it('returns null for null input', () => {
    expect(cleanArticleContent(null)).toBeNull()
  })

  it('returns content unchanged when there is no truncation marker', () => {
    expect(cleanArticleContent('Full content.')).toBe('Full content.')
  })

  it('cuts off content at the truncation marker', () => {
    expect(cleanArticleContent('Real content. [+123 chars] filler text')).toBe('Real content.')
  })

  it('returns null when the content is only whitespace', () => {
    expect(cleanArticleContent('   ')).toBeNull()
  })

  it('returns null when the content is only a truncation marker', () => {
    expect(cleanArticleContent('[+50 chars] filler')).toBeNull()
  })
})
