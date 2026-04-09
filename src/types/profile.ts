export type UserRole = 'admin' | 'editor'

/** Stored in bcc_profiles.preferences — align keys with BP-504 (draft tone/topics). */
export type ThemePreference = 'dark' | 'light'

export interface UserPreferences {
  tone?: string
  topics?: string[]
  publication_name?: string
  linkedin_url?: string
  theme?: ThemePreference
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  role: UserRole
  created_at: string
  avatar_url?: string | null
  preferences?: UserPreferences | null
}
