import { useCallback, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type ProfileRole = 'admin' | 'editor'

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: ProfileRole
  created_at: string | null
}

export function useAuth() {
  const skipAuth = import.meta.env.VITE_DEV_SKIP_AUTH === 'true'

  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)

  const refreshProfile = useCallback(async (u: User | null) => {
    if (!u) {
      setProfile(null)
      return
    }
    setProfileLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .single()

      if (error) {
        setProfile(null)
        return
      }

      setProfile(data as Profile)
    } finally {
      setProfileLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (skipAuth) {
        if (!mounted) return
        setUser(null)
        setProfile({
          id: 'dev-skip-auth',
          email: 'dev@local',
          full_name: 'Dev Mode',
          role: 'admin',
          created_at: null,
        })
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.getSession()
      const u = data.session?.user ?? null
      if (!mounted) return
      setUser(u)
      setLoading(false)
      await refreshProfile(u)
    })()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      refreshProfile(u)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [refreshProfile, skipAuth])

  const signIn = useCallback(async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password })
  }, [])

  const signOut = useCallback(async () => {
    return supabase.auth.signOut()
  }, [])

  const canPublish = useMemo(() => {
    if (skipAuth) return true
    return profile?.role === 'admin'
  }, [profile?.role, skipAuth])

  return {
    skipAuth,
    user,
    profile,
    loading,
    profileLoading,
    canPublish,
    refreshProfile: () => refreshProfile(user),
    signIn,
    signOut,
  }
}

