// Nuxt dev compiles each route (page and API) on its first request. Without
// this, whichever test happens to run first pays that compile cost and can
// time out waiting on an assertion that has nothing to do with compilation.
// Hitting the key routes once here, before any test runs, means every real
// test starts against an already-warm server.
export default async function globalSetup() {
  const baseURL = 'http://localhost:3000'
  const routes = ['/', '/login', '/bookmarks', '/api/articles']

  for (const route of routes) {
    await fetch(`${baseURL}${route}`).catch(() => {})
  }

  // POST routes need an actual request of that method to force Nitro to
  // load the handler file - a harmless throwaway login attempt does that.
  await fetch(`${baseURL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'warmup@example.com', password: 'warmup' }),
  }).catch(() => {})
}
