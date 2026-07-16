export default defineEventHandler((event) => {
  const token = getCookie(event, SESSION_COOKIE_NAME)
  destroySession(token)
  deleteCookie(event, SESSION_COOKIE_NAME, { path: '/' })
  return { success: true }
})
