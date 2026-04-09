import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

const skipAuth =
  import.meta.env.DEV &&
  (import.meta.env.VITE_DEV_SKIP_AUTH === 'true' ||
    import.meta.env.VITE_DEV_SKIP_AUTH === '1')

export default function LoginPage() {
  const { user, signIn, signUp, signInWithGoogle } = useAuth()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    '/topics'

  useEffect(() => {
    const oauthError = (location.state as { oauthError?: string } | null)
      ?.oauthError
    if (oauthError) setError(oauthError)
  }, [location.state])

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [oauthBusy, setOauthBusy] = useState(false)

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

        <div className="mb-6">
          <button
            type="button"
            disabled={oauthBusy}
            onClick={async () => {
              setError(null)
              setOauthBusy(true)
              try {
                const { error: err } = await signInWithGoogle()
                if (err) setError(err.message)
              } finally {
                setOauthBusy(false)
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-beagle-btn border border-beagle-border bg-beagle-surface px-6 py-3 text-sm font-medium uppercase tracking-wider text-beagle-text-heading hover:border-beagle-border-hover disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {oauthBusy ? 'Redirecting…' : 'Continue with Google'}
          </button>
          <p className="mt-4 text-center text-xs text-beagle-text-dimmed">
            or use email below
          </p>
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
