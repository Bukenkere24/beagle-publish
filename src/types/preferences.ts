export interface UserPreferences {
  defaultTone: 'professional' | 'casual' | 'technical' | 'creative'
  topicsOfInterest: string[]
  publicationName: string
  linkedinProfileUrl: string
  autoSaveEnabled: boolean
  onboardingComplete: boolean
  theme: 'light' | 'dark' | 'system'
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
