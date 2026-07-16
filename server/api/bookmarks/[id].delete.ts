export default defineEventHandler((event) => {
  const user = requireAuthUser(event)
  const id = getRouterParam(event, 'id')
  const removed = id ? removeBookmark(user.id, id) : false

  if (!removed) {
    throw createError({ statusCode: 404, statusMessage: 'Bookmark not found.' })
  }

  return { success: true }
})
