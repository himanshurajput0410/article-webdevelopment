export function formatPublishedDate(value: string | null): string {
  if (!value) return 'Date unknown'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unknown'

  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

/** Short relative time (e.g. "10h ago"), falling back to an absolute date past a week old. */
export function formatRelativeTime(value: string | null): string {
  if (!value) return 'Date unknown'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unknown'

  const diffSeconds = Math.round((Date.now() - date.getTime()) / 1000)
  if (diffSeconds < 60) return 'Just now'

  const diffMinutes = Math.round(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return formatPublishedDate(value)
}

/**
 * The feed truncates content with a "[+123 chars]" marker and, in this
 * mock, appends unrelated filler text after it. Cut at the marker so the
 * UI never renders that inconsistent trailing text.
 */
export function cleanArticleContent(content: string | null): string | null {
  if (!content) return null

  const markerIndex = content.indexOf('[+')
  const trimmed = markerIndex === -1 ? content : content.slice(0, markerIndex)

  return trimmed.trim() || null
}
