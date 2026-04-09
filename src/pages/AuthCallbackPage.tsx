import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Completing sign in…')

  useEffect(() => {
    let cancelled = false

    async function finish() {
      const { data, error } = await supabase.auth.getSession()
      if (cancelled) return
      if (error) {
        setMessage(error.message)
        navigate('/login', { replace: true, state: { oauthError: error.message } })
        return
      }
      if (data.session) {
        navigate('/topics', { replace: true })
        return
      }
      setMessage('Could not complete sign in.')
      navigate('/login', { replace: true, state: { oauthError: 'No session' } })
    }

    void finish()
    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-beagle-bg p-4">
      <p className="text-beagle-text-muted">{message}</p>
    </div>
  )
}
