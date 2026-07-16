export default defineEventHandler((event) => {
  const user = requireAuthUser(event)
  return listBookmarks(user.id).map(toPublicBookmark)
})
