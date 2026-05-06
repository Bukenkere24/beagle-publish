import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from '../lib/supabase'
import { applyThemeClass, mergePreferences } from '../lib/preferences'
import type { UserPreferences } from '../types/preferences'
import { useAuth } from './AuthContext'

const PROFILE_TABLE =
  (import.meta.env.VITE_PROFILES_TABLE as string | undefined) || 'bcc_profiles'

const SAVE_DEBOUNCE_MS = 600

type PreferencesContextValue = {
  preferences: UserPreferences
  updatePreferences: (partial: Partial<UserPreferences>) => void
  saving: boolean
  saveError: string | null
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user, profile, refreshProfile } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    mergePreferences(profile?.preferences),
  )
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<UserPreferences | null>(null)

  useEffect(() => {
    setPreferences(mergePreferences(profile?.preferences))
  }, [profile?.id, profile?.preferences])

  useEffect(() => {
    applyThemeClass(preferences.theme)
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    if (preferences.theme !== 'system') {
      return undefined
    }
    const onChange = () => applyThemeClass('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [preferences.theme])

  const flushSave = useCallback(async () => {
    const next = pendingRef.current
    pendingRef.current = null
    if (!next || !user?.id) return

    setSaving(true)
    setSaveError(null)
    try {
      const { error } = await supabase
        .from(PROFILE_TABLE)
        .update({ preferences: next })
        .eq('id', user.id)

      if (error) throw error
      await refreshProfile()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }, [refreshProfile, user?.id])

  const updatePreferences = useCallback(
    (partial: Partial<UserPreferences>) => {
      setPreferences((prev) => {
        const merged: UserPreferences = { ...prev, ...partial }
        pendingRef.current = merged

        if (timerRef.current) clearTimeout(timerRef.current)
        if (!user?.id) {
          return merged
        }

        timerRef.current = setTimeout(() => {
          timerRef.current = null
          void flushSave()
        }, SAVE_DEBOUNCE_MS)

        return merged
      })
    },
    [flushSave, user?.id],
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const value = useMemo(
    () => ({
      preferences,
      updatePreferences,
      saving,
      saveError,
    }),
    [preferences, updatePreferences, saving, saveError],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext)
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider')
  }
  return ctx
}

export function useThemeToggle() {
  const { preferences, updatePreferences } = usePreferences()

  const cycleTheme = useCallback(() => {
    const order: UserPreferences['theme'][] = ['dark', 'light', 'system']
    const i = order.indexOf(preferences.theme)
    const next = order[(i + 1) % order.length]
    updatePreferences({ theme: next })
  }, [preferences.theme, updatePreferences])

  return { theme: preferences.theme, cycleTheme }
}
