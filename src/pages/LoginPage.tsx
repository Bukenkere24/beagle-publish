import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { user, signIn, signUp, signInWithGoogle } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/topics'

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to={from} replace />

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
        else setError('Check your email to confirm your account, then sign in.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setSubmitting(true)
    try {
      const { error: err } = await signInWithGoogle()
      if (err) setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-beagle-bg p-4 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-beagle-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-beagle-primary/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md beagle-glass border border-beagle-border p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-beagle-primary/10 mb-4">
            <div className="w-5 h-5 bg-beagle-primary rounded-full animate-pulse" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-beagle-text-heading mb-2">Beagle Publish</h1>
          <p className="text-beagle-text-muted text-sm tracking-wide">Blog Command Center & Automation</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-zinc-900 font-bold py-4 px-6 rounded-full flex items-center justify-center gap-3 hover:bg-zinc-100 transition-all duration-300 shadow-lg shadow-white/5 mb-8"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-beagle-border"></div>
          </div>
          <span className="relative px-4 bg-[#0a0a0a] text-[10px] font-bold uppercase tracking-[0.2em] text-beagle-text-dimmed">Or email</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <div>
              <input
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-full border border-beagle-border bg-beagle-surface px-6 py-4 text-beagle-white placeholder-beagle-text-dimmed focus:border-beagle-primary focus:outline-none transition-all"
                placeholder="Full Name"
              />
            </div>
          )}
          <div>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-full border border-beagle-border bg-beagle-surface px-6 py-4 text-beagle-white placeholder-beagle-text-dimmed focus:border-beagle-primary focus:outline-none transition-all"
              placeholder="Email Address"
            />
          </div>
          <div>
            <input
              type="password"
              required
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-beagle-border bg-beagle-surface px-6 py-4 text-beagle-white placeholder-beagle-text-dimmed focus:border-beagle-primary focus:outline-none transition-all"
              placeholder="Password"
            />
          </div>

          {error && <p className="text-xs text-red-400 font-medium px-2">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-beagle-primary py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-beagle-primary-hover disabled:opacity-50 transition-all shadow-lg shadow-beagle-primary/20"
          >
            {submitting ? 'Authenticating…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-xs font-bold uppercase tracking-widest text-beagle-text-muted hover:text-beagle-primary transition-colors"
          >
            {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
