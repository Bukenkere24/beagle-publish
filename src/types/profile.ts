export type UserRole = 'admin' | 'editor'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  role: UserRole
  created_at: string
}
