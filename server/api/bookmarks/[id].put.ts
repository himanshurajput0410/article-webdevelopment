import { validateNote } from '~/utils/validateNote'

export default defineEventHandler(async (event) => {
  const user = requireAuthUser(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ note?: string }>(event)

  const validated = validateNote(body?.note ?? '')
  if (!validated.valid) {
    throw createError({ statusCode: 422, statusMessage: validated.message })
  }

  const updated = id ? updateBookmarkNote(user.id, id, validated.value) : null
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Bookmark not found.' })
  }

  return toPublicBookmark(updated)
})
