export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = body?.email?.trim() ?? ''
  const password = body?.password ?? ''

  if (!email || !password) {
    throw createError({ statusCode: 422, statusMessage: 'Email and password are required.' })
  }

  const user = verifyCredentials(email, password)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password.' })
  }

  const token = createSession(user.id)
  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return { id: user.id, email: user.email, name: user.name }
})
