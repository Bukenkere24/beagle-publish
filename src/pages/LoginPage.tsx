import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

const skipAuth =
  import.meta.env.VITE_DEV_SKIP_AUTH === 'true' ||
  import.meta.env.VITE_DEV_SKIP_AUTH === '1'

export default function LoginPage() {
  const { user, signIn, signUp } = useAuth()
  const location = useLocation()
  const fromLocation = (location.state as { from?: { pathname: string; search?: string } })
    ?.from
  const from = fromLocation
    ? `${fromLocation.pathname}${fromLocation.search ?? ''}`
    : '/topics'

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (skipAuth) {
    return <Navigate to="/topics" replace />
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (mode === 'signin') {
        const { error: err } = await signIn(email, password)
        if (err) setError(err.message)
      } else {
        const { error: err } = await signUp(email, password, fullName)
        if (err) setError(err.message)
        else
          setError(
            'Check your email to confirm your account, then sign in.',
          )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-beagle-bg p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-beagle border border-beagle-border bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8"
      >
        <h1 className="mb-2 text-center font-heading text-2xl font-semibold text-beagle-text-heading">
          Blog Command Center
        </h1>
        <p className="mb-6 text-center text-sm text-beagle-text-muted">
          Sign in with your team account
        </p>

        <div className="mb-6 flex gap-2 rounded-beagle border border-beagle-border bg-beagle-surface p-1">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setError(null)
            }}
            className={`flex-1 rounded-[2px] py-2 text-sm font-medium uppercase tracking-wider ${
              mode === 'signin'
                ? 'bg-beagle-primary text-white'
                : 'text-beagle-text-muted'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError(null)
            }}
            className={`flex-1 rounded-[2px] py-2 text-sm font-medium uppercase tracking-wider ${
              mode === 'signup'
                ? 'bg-beagle-primary text-white'
                : 'text-beagle-text-muted'
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-beagle-text-dimmed">
                Full name
              </label>
              <input
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-beagle border border-beagle-border bg-beagle-surface px-4 py-3 text-beagle-white placeholder-beagle-text-dimmed focus:border-beagle-border-hover focus:outline-none"
                placeholder="Ada Lovelace"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-beagle-text-dimmed">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-beagle border border-beagle-border bg-beagle-surface px-4 py-3 text-beagle-white placeholder-beagle-text-dimmed focus:border-beagle-border-hover focus:outline-none"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-beagle-text-dimmed">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete={
                mode === 'signin' ? 'current-password' : 'new-password'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-beagle border border-beagle-border bg-beagle-surface px-4 py-3 text-beagle-white placeholder-beagle-text-dimmed focus:border-beagle-border-hover focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-beagle-btn bg-beagle-primary px-6 py-4 text-sm font-medium uppercase tracking-wider text-white hover:bg-beagle-primary-hover disabled:opacity-50"
          >
            {submitting
              ? 'Please wait…'
              : mode === 'signin'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

      </motion.div>
    </div>
  )
}
