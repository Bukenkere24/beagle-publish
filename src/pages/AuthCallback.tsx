import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/topics', { replace: true })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        navigate('/topics', { replace: true })
      }
      if (event === 'SIGNED_OUT') {
        navigate('/login', { replace: true })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-beagle-bg text-beagle-text-muted">
      <Loader2 className="animate-spin mb-4 text-beagle-primary" size={40} />
      <p className="text-sm font-bold uppercase tracking-[0.2em]">Authenticating with Google...</p>
    </div>
  )
}
