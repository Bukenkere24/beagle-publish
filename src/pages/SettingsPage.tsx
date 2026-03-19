import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export default function SettingsPage() {
  const { user, profile, skipAuth, signOut } = useAuth()

  const email = profile?.email ?? user?.email ?? (skipAuth ? 'dev@local' : null)
  const role = profile?.role ?? (skipAuth ? 'admin' : null)

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-beagle mx-auto"
    >
      <h1 className="text-beagle-text-heading font-heading font-semibold text-4xl mb-8">
        Settings
      </h1>
      <div className="rounded-beagle border border-beagle-border bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 space-y-4">
        <div>
          <p className="text-beagle-text-muted text-xs uppercase tracking-widest font-semibold mb-1">Email</p>
          <p className="text-beagle-text-body">{email ?? 'Not signed in'}</p>
        </div>
        <div>
          <p className="text-beagle-text-muted text-xs uppercase tracking-widest font-semibold mb-1">Role</p>
          <span className="inline-flex items-center rounded bg-beagle-border px-2 py-1 text-xs text-beagle-text-muted">
            {role ?? '—'}
          </span>
        </div>
        {!skipAuth && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-beagle-btn px-6 py-3 uppercase tracking-wider font-medium border border-beagle-border text-beagle-text-muted hover:bg-beagle-primary-ghost hover:text-beagle-primary hover:border-beagle-primary transition-colors"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </motion.section>
  )
}
