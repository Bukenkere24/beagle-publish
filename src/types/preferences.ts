export type WritingTone = 'professional' | 'casual' | 'technical' | 'creative'

export type ThemePreference = 'light' | 'dark' | 'system'

export interface UserPreferences {
  defaultTone: WritingTone
  topicsOfInterest: string[]
  publicationName: string
  linkedinProfileUrl: string
  autoSaveEnabled: boolean
  onboardingComplete: boolean
  theme: ThemePreference
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultTone: 'professional',
  topicsOfInterest: [],
  publicationName: '',
  linkedinProfileUrl: '',
  autoSaveEnabled: true,
  onboardingComplete: false,
  theme: 'dark',
}
