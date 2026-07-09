/**
 * The article feed has no stable identifier, only a unique `url`. This
 * produces a short, deterministic, URL-safe id from that url so articles
 * are routable (e.g. /articles/:id) without a second network call.
 */
export function hashToId(value: string): string {
  let hash = 5381

  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i)
  }

  return (hash >>> 0).toString(36)
}
