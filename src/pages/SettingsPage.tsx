import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { usePreferences } from '../hooks/usePreferences'

const TONE_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'professional', label: 'Professional' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'technical', label: 'Technical' },
  { value: 'friendly', label: 'Friendly' },
]

export default function SettingsPage() {
  const { user, profile, signOut, loading } = useAuth()
  const { draft, updatePreferences, saveState } = usePreferences()

  const topicsValue = (draft.topics ?? []).join(', ')

  const onTopicsChange = useCallback(
    (raw: string) => {
      const topics = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      updatePreferences({ topics })
    },
    [updatePreferences],
  )

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-beagle"
    >
      <h1 className="mb-2 font-heading text-4xl font-semibold text-beagle-text-heading">
        Settings
      </h1>
      <p className="mb-2 text-beagle-text-muted">
        Account, role, and writing preferences (BP-505). Preferences are debounced and
        stored in <code className="text-beagle-text-secondary">bcc_profiles.preferences</code>{' '}
        for use in drafts (BP-504).
      </p>
      <p className="mb-8 text-xs text-beagle-text-dimmed">
        {saveState === 'saving' && 'Saving preferences…'}
        {saveState === 'saved' && 'Preferences saved.'}
        {saveState === 'error' && 'Could not save preferences.'}
      </p>

      <div className="space-y-8">
        <div className="rounded-beagle border border-beagle-border bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-beagle-text-heading">
            Account
          </h2>
          {loading ? (
            <p className="text-beagle-text-muted">Loading profile…</p>
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

        <div className="rounded-beagle border border-beagle-border bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-beagle-text-heading">
            Writing &amp; publication
          </h2>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="pref-tone"
                className="mb-1 block text-xs uppercase tracking-wider text-beagle-text-dimmed"
              >
                Default tone
              </label>
              <select
                id="pref-tone"
                value={draft.tone ?? ''}
                onChange={(e) =>
                  updatePreferences({
                    tone: e.target.value || undefined,
                  })
                }
                className="w-full max-w-md rounded-beagle border border-beagle-border bg-beagle-surface px-4 py-3 text-beagle-white focus:border-beagle-border-hover focus:outline-none"
              >
                {TONE_OPTIONS.map((o) => (
                  <option key={o.value || 'default'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="pref-topics"
                className="mb-1 block text-xs uppercase tracking-wider text-beagle-text-dimmed"
              >
                Preferred topics
              </label>
              <input
                id="pref-topics"
                type="text"
                value={topicsValue}
                onChange={(e) => onTopicsChange(e.target.value)}
                className="w-full rounded-beagle border border-beagle-border bg-beagle-surface px-4 py-3 text-beagle-white placeholder-beagle-text-dimmed focus:border-beagle-border-hover focus:outline-none"
                placeholder="e.g. AI, product, leadership"
              />
              <p className="mt-1 text-xs text-beagle-text-dimmed">
                Comma-separated list; debounced save like other fields.
              </p>
            </div>

            <div>
              <label
                htmlFor="pref-pub"
                className="mb-1 block text-xs uppercase tracking-wider text-beagle-text-dimmed"
              >
                Publication name
              </label>
              <input
                id="pref-pub"
                type="text"
                value={draft.publication_name ?? ''}
                onChange={(e) =>
                  updatePreferences({ publication_name: e.target.value || undefined })
                }
                className="w-full max-w-md rounded-beagle border border-beagle-border bg-beagle-surface px-4 py-3 text-beagle-white placeholder-beagle-text-dimmed focus:border-beagle-border-hover focus:outline-none"
                placeholder="Your blog or newsletter name"
              />
            </div>

            <div>
              <label
                htmlFor="pref-li"
                className="mb-1 block text-xs uppercase tracking-wider text-beagle-text-dimmed"
              >
                LinkedIn URL
              </label>
              <input
                id="pref-li"
                type="url"
                value={draft.linkedin_url ?? ''}
                onChange={(e) =>
                  updatePreferences({ linkedin_url: e.target.value || undefined })
                }
                className="w-full max-w-md rounded-beagle border border-beagle-border bg-beagle-surface px-4 py-3 text-beagle-white placeholder-beagle-text-dimmed focus:border-beagle-border-hover focus:outline-none"
                placeholder="https://www.linkedin.com/in/…"
              />
            </div>

            <div>
              <span className="mb-2 block text-xs uppercase tracking-wider text-beagle-text-dimmed">
                Theme
              </span>
              <div className="flex gap-2">
                {(['dark', 'light'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updatePreferences({ theme: t })}
                    className={`rounded-beagle-btn px-4 py-2 text-sm font-medium uppercase tracking-wider ${
                      (draft.theme ?? 'dark') === t
                        ? 'bg-beagle-primary text-white'
                        : 'border border-beagle-border text-beagle-text-muted hover:border-beagle-border-hover'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
