import type { H3Event } from 'h3'

export function requireAuthUser(event: H3Event) {
  const user = event.context.auth?.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'You need to log in to do that.' })
  }
  return user
}
