export default defineEventHandler((event) => {
  const token = getCookie(event, SESSION_COOKIE_NAME)
  const session = getStoredSession(token)
  const user = session ? findUserById(session.userId) : null

  event.context.auth = {
    user: user ? { id: user.id, email: user.email, name: user.name } : null,
  }
})
