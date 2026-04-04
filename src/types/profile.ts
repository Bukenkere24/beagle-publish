export type UserRole = 'admin' | 'editor'

export interface UserPreferences {
  defaultTone?: 'professional' | 'casual' | 'technical' | 'creative'
  topicsOfInterest?: string[]
  publicationName?: string
  linkedinProfileUrl?: string
  theme?: 'light' | 'dark' | 'system'
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url?: string | null
  role: UserRole
  preferences?: UserPreferences | null
  created_at: string
}
