import { validateNote } from '~/utils/validateNote'

export default defineEventHandler(async (event) => {
  const user = requireAuthUser(event)
  const body = await readBody<{ articleId?: string; note?: string }>(event)
  const articleId = body?.articleId?.trim() ?? ''

  if (!articleId) {
    throw createError({ statusCode: 422, statusMessage: 'articleId is required.' })
  }

  if (!findArticleById(articleId)) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found.' })
  }

  const validated = validateNote(body?.note ?? '')
  if (!validated.valid) {
    throw createError({ statusCode: 422, statusMessage: validated.message })
  }

  return toPublicBookmark(createBookmark(user.id, articleId, validated.value))
})
