export interface SeedUser {
  id: string
  email: string
  password: string
  name: string
}

const users: SeedUser[] = [
  { id: 'u1', email: 'ada@example.com', password: 'password123', name: 'Ada Lovelace' },
  { id: 'u2', email: 'grace@example.com', password: 'password123', name: 'Grace Hopper' },
  { id: 'u3', email: 'alan@example.com', password: 'password123', name: 'Alan Turing' },
]

export function findUserByEmail(email: string): SeedUser | null {
  return users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase()) ?? null
}

export function findUserById(id: string): SeedUser | null {
  return users.find((user) => user.id === id) ?? null
}

export function verifyCredentials(email: string, password: string): SeedUser | null {
  const user = findUserByEmail(email)
  return user && user.password === password ? user : null
}
