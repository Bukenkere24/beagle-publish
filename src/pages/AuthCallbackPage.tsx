import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const MAX_ATTEMPTS = 10
const RETRY_MS = 350

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const resolveSession = async (attempt: number) => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (cancelled) return

      if (sessionError) {
        console.error('Auth callback error:', sessionError)
        setError(sessionError.message)
        setTimeout(() => navigate('/login', { replace: true }), 3200)
        return
      }

      if (session) {
        navigate('/topics', { replace: true })
        return
      }

      if (attempt < MAX_ATTEMPTS) {
        setTimeout(() => void resolveSession(attempt + 1), RETRY_MS)
      } else {
        navigate('/login', { replace: true })
      }
    }

    void resolveSession(0)
    return () => {
      cancelled = true
    }
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-beagle-bg px-4">
        <p className="text-red-600 dark:text-red-400 font-heading text-center">
          Authentication failed: {error}
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-beagle-bg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-beagle-primary border-t-transparent mx-auto mb-4" />
        <p className="text-zinc-600 dark:text-beagle-text-muted font-heading">Authenticating…</p>
      </div>
    </div>
  )
}
