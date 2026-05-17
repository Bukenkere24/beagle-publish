import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { PageLoader } from '../components/ui/PageState'

export default function SettingsPage() {
  const { user, profile, signOut, loading } = useAuth()

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-beagle"
    >
      <h1 className="mb-2 font-heading text-4xl font-semibold text-beagle-text-heading">
        Settings
      </h1>
      <p className="mb-8 text-beagle-text-muted">
        Account and role for Blog Command Center (BP-407).
      </p>

      <div className="rounded-beagle border border-beagle-border bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6">
        {loading ? (
          <PageLoader label="Loading profile…" />
        ) : (
          <dl className="space-y-4">
            <div>
              <dt className="text-xs uppercase tracking-wider text-beagle-text-dimmed">
                Email
              </dt>
              <dd className="mt-1 text-beagle-text-heading">
                {user?.email ?? '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-beagle-text-dimmed">
                Display name
              </dt>
              <dd className="mt-1 text-beagle-text-heading">
                {profile?.full_name || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-beagle-text-dimmed">
                Role
              </dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex rounded-beagle px-2 py-1 text-sm font-medium ${
                    profile?.role === 'admin'
                      ? 'bg-beagle-primary-ghost text-beagle-primary'
                      : 'bg-zinc-800 text-beagle-text-muted'
                  }`}
                >
                  {profile?.role ?? 'editor'}
                </span>
                {profile?.role !== 'admin' && (
                  <p className="mt-2 text-sm text-beagle-text-dimmed">
                    Editors can draft and edit. Publishing requires an admin.
                  </p>
                )}
              </dd>
            </div>
          </dl>
        )}

        <div className="mt-8 border-t border-beagle-border pt-6">
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-beagle-btn border border-beagle-border px-4 py-2 text-sm uppercase tracking-wider text-beagle-text-secondary hover:border-beagle-border-hover"
          >
            Sign out
          </button>
        </div>
      </div>
    </motion.section>
  )
}
