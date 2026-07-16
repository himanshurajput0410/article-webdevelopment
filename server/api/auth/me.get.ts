export default defineEventHandler((event) => {
  const user = event.context.auth?.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated.' })
  }
  return user
})
