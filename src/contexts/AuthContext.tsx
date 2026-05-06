import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { mergePreferences } from '../lib/preferences'
import type { UserPreferences } from '../types/preferences'

export type ProfileRole = 'admin' | 'editor'

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  role: ProfileRole
  created_at: string | null
  avatar_url: string | null
  preferences: UserPreferences | null
}

/** Week 5 uses `bcc_profiles`. Set `VITE_PROFILES_TABLE=profiles` if your DB still uses the old name. */
const PROFILE_TABLE =
  (import.meta.env.VITE_PROFILES_TABLE as string | undefined) || 'bcc_profiles'

type AuthContextValue = {
  user: User | null
  profile: Profile | null
  loading: boolean
  profileLoading: boolean
  canPublish: boolean
  refreshProfile: () => Promise<void>
  signIn: (email: string, password: string) => ReturnType<typeof supabase.auth.signInWithPassword>
  signOut: () => ReturnType<typeof supabase.auth.signOut>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function mapProfileRow(data: Record<string, unknown>): Profile {
  return {
    id: String(data.id),
    email: (data.email as string | null) ?? null,
    full_name: (data.full_name as string | null) ?? null,
    role: (data.role as ProfileRole) === 'admin' ? 'admin' : 'editor',
    created_at: (data.created_at as string | null) ?? null,
    avatar_url: (data.avatar_url as string | null) ?? null,
    preferences: data.preferences != null ? mergePreferences(data.preferences) : null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
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
        .from(PROFILE_TABLE)
        .select('id, email, full_name, role, created_at, avatar_url, preferences')
        .eq('id', u.id)
        .single()

      if (error || !data) {
        setProfile(null)
        return
      }

      setProfile(mapProfileRow(data as Record<string, unknown>))
    } finally {
      setProfileLoading(false)
    }
  }, [])

  const doRefreshProfile = useCallback(async () => {
    await refreshProfile(user)
  }, [refreshProfile, user])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      const u = data.session?.user ?? null
      if (!mounted) return
      setUser(u)
      setLoading(false)
      await refreshProfile(u)
    })()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      void refreshProfile(u)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [refreshProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password })
  }, [])

  const signOut = useCallback(async () => {
    return supabase.auth.signOut()
  }, [])

  const canPublish = useMemo(() => profile?.role === 'admin', [profile?.role])

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      profileLoading,
      canPublish,
      refreshProfile: doRefreshProfile,
      signIn,
      signOut,
    }),
    [
      user,
      profile,
      loading,
      profileLoading,
      canPublish,
      doRefreshProfile,
      signIn,
      signOut,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
