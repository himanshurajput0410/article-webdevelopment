export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const article = id ? findArticleById(id) : null

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found.' })
  }

  return article
})
