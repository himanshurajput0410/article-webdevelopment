// The feed has no article id, only a unique url. This turns that url
// into a short id so articles can have their own route.
export function hashToId(value: string): string {
  let hash = 5381

  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i)
  }

  return (hash >>> 0).toString(36)
}
