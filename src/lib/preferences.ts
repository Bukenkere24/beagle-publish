import {
  DEFAULT_PREFERENCES,
  type ThemePreference,
  type UserPreferences,
  type WritingTone,
} from '../types/preferences'

const TONES: WritingTone[] = ['professional', 'casual', 'technical', 'creative']
const THEMES: ThemePreference[] = ['light', 'dark', 'system']

function isWritingTone(v: unknown): v is WritingTone {
  return typeof v === 'string' && TONES.includes(v as WritingTone)
}

function isThemePreference(v: unknown): v is ThemePreference {
  return typeof v === 'string' && THEMES.includes(v as ThemePreference)
}

/** Merges stored JSON with defaults for safe UI + saves. */
export function mergePreferences(raw: unknown): UserPreferences {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_PREFERENCES }
  }
  const p = raw as Record<string, unknown>
  const topics = p.topicsOfInterest
  return {
    ...DEFAULT_PREFERENCES,
    defaultTone: isWritingTone(p.defaultTone) ? p.defaultTone : DEFAULT_PREFERENCES.defaultTone,
    topicsOfInterest: Array.isArray(topics)
      ? topics.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
      : DEFAULT_PREFERENCES.topicsOfInterest,
    publicationName:
      typeof p.publicationName === 'string' ? p.publicationName : DEFAULT_PREFERENCES.publicationName,
    linkedinProfileUrl:
      typeof p.linkedinProfileUrl === 'string'
        ? p.linkedinProfileUrl
        : DEFAULT_PREFERENCES.linkedinProfileUrl,
    autoSaveEnabled:
      typeof p.autoSaveEnabled === 'boolean' ? p.autoSaveEnabled : DEFAULT_PREFERENCES.autoSaveEnabled,
    onboardingComplete:
      typeof p.onboardingComplete === 'boolean'
        ? p.onboardingComplete
        : DEFAULT_PREFERENCES.onboardingComplete,
    theme: isThemePreference(p.theme) ? p.theme : DEFAULT_PREFERENCES.theme,
  }
}

export function applyThemeClass(theme: ThemePreference) {
  const root = document.documentElement
  if (theme === 'system') {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', dark)
    return
  }
  root.classList.toggle('dark', theme === 'dark')
}
