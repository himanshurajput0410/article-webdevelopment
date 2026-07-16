import type { ApiUser } from '~/models/api/auth'
import type { User } from '~/models/domain/user'

export function mapApiUserToDomain(raw: ApiUser): User {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name?.trim() || raw.email,
  }
}
