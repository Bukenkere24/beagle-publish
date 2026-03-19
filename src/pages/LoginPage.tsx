import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = useMemo(() => {
    const state = location.state as { from?: { pathname?: string } } | null
    return state?.from?.pathname ?? '/topics'
  }, [location.state])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const skipAuth = import.meta.env.VITE_DEV_SKIP_AUTH === 'true'

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) throw error
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-beagle-bg p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-beagle border border-beagle-border bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8"
      >
        <h1 className="text-beagle-text-heading font-heading font-semibold text-2xl mb-6 text-center">
          Blog Command Center
        </h1>
        {skipAuth && (
          <div className="mb-6 rounded-beagle border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
            Dev bypass is enabled (`VITE_DEV_SKIP_AUTH=true`). AuthGuard will skip login checks.
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-beagle-surface border border-beagle-border rounded-beagle px-4 py-3 text-beagle-white placeholder-beagle-text-dimmed"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-beagle-surface border border-beagle-border rounded-beagle px-4 py-3 text-beagle-white placeholder-beagle-text-dimmed"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-beagle-primary text-white rounded-beagle-btn px-6 py-4 uppercase tracking-wider font-medium hover:bg-beagle-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
