import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { applyDocumentTheme } from '../lib/theme'
import type { UserPreferences } from '../types/profile'
import { useAuth } from './useAuth'

const DEBOUNCE_MS = 500

function mergePreferences(
  base: UserPreferences | null | undefined,
  patch: Partial<UserPreferences>,
): UserPreferences {
  return { ...(base ?? {}), ...patch }
}

export function usePreferences() {
  const { user, profile, refreshProfile } = useAuth()
  const [draft, setDraft] = useState<UserPreferences>({})
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle',
  )
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* eslint-disable react-hooks/set-state-in-effect -- mirror server JSON after load / refreshProfile */
  useEffect(() => {
    const next = profile?.preferences ?? {}
    setDraft(next)
  }, [profile?.preferences])
  /* eslint-enable react-hooks/set-state-in-effect */

  const persist = useCallback(
    async (prefs: UserPreferences) => {
      if (!user?.id) return
      setSaveState('saving')
      const { error } = await supabase
        .from('bcc_profiles')
        .update({ preferences: prefs })
        .eq('id', user.id)
      if (error) {
        console.warn('preferences save:', error.message)
        setSaveState('error')
        return
      }
      await refreshProfile()
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    },
    [user, refreshProfile],
  )

  const schedulePersist = useCallback(
    (prefs: UserPreferences) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        void persist(prefs)
      }, DEBOUNCE_MS)
    },
    [persist],
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const updatePreferences = useCallback(
    (patch: Partial<UserPreferences>) => {
      setDraft((prev) => {
        const next = mergePreferences(prev, patch)
        if (patch.theme !== undefined) {
          applyDocumentTheme(patch.theme)
        }
        schedulePersist(next)
        return next
      })
    },
    [schedulePersist],
  )

  return { draft, updatePreferences, saveState }
}
