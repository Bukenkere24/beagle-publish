import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const skipAuth = import.meta.env.VITE_DEV_SKIP_AUTH === 'true'

  useEffect(() => {
    if (skipAuth) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [skipAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beagle-bg">
        <p className="text-beagle-text-muted">Loading...</p>
      </div>
    )
  }

  if (!skipAuth && !session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
