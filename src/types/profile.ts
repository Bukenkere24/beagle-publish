import type { UserPreferences } from './preferences'

export type UserRole = 'admin' | 'editor'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url?: string | null
  role: UserRole
  preferences?: UserPreferences | null
  created_at: string
}
