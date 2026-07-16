export const SESSION_COOKIE_NAME = 'session_token'

interface StoredSession {
  userId: string
  expiresAt: number
}

// Resets whenever the Nitro dev server restarts - fine for a mock backend.
const sessions = new Map<string, StoredSession>()
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

export function createSession(userId: string): string {
  const token = crypto.randomUUID()
  sessions.set(token, { userId, expiresAt: Date.now() + SESSION_TTL_MS })
  return token
}

export function getStoredSession(token: string | undefined): StoredSession | null {
  if (!token) return null

  const session = sessions.get(token)
  if (!session) return null

  if (session.expiresAt < Date.now()) {
    sessions.delete(token)
    return null
  }

  return session
}

export function destroySession(token: string | undefined): void {
  if (token) sessions.delete(token)
}
