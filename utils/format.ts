export function formatPublishedDate(value: string | null): string {
  if (!value) return 'Date unknown'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unknown'

  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
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
