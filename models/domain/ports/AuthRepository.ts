import type { User } from '~/models/domain/user'

export interface LoginInput {
  email: string
  password: string
}

export interface AuthRepository {
  login(input: LoginInput): Promise<User>
  logout(): Promise<void>
  me(): Promise<User | null>
}
