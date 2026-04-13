import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { usePreferences } from '../hooks/usePreferences'
import { DEFAULT_PREFERENCES, type WritingTone } from '../types/preferences'

const TONES: { value: WritingTone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'technical', label: 'Technical' },
  { value: 'creative', label: 'Creative' },
]

const THEMES: { value: (typeof DEFAULT_PREFERENCES)['theme']; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
]

export default function SettingsPage() {
  const { user, profile, skipAuth, signOut } = useAuth()
  const { preferences, updatePreferences, saving, saveError } = usePreferences()
  const [tagInput, setTagInput] = useState(() => preferences.topicsOfInterest.join(', '))

  /* eslint-disable react-hooks/set-state-in-effect -- sync tags when preferences load from Supabase */
  useEffect(() => {
    setTagInput(preferences.topicsOfInterest.join(', '))
  }, [preferences.topicsOfInterest])
  /* eslint-enable react-hooks/set-state-in-effect */

  const email = profile?.email ?? user?.email ?? (skipAuth ? 'dev@local' : null)
  const role = profile?.role ?? (skipAuth ? 'admin' : null)
  const displayName = profile?.full_name ?? '—'
  const avatarUrl = profile?.avatar_url

  const commitTags = () => {
    const topics = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    updatePreferences({ topicsOfInterest: topics })
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-beagle mx-auto space-y-8"
    >
      <div>
        <h1 className="text-zinc-900 dark:text-beagle-text-heading font-heading font-semibold text-4xl mb-2">
          Settings
        </h1>
        <p className="text-zinc-600 dark:text-beagle-text-muted text-sm">
          Preferences feed the AI draft engine and your workspace theme.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-beagle-border bg-white dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-white/[0.01] p-6 space-y-6 shadow-sm dark:shadow-none">
        <h2 className="text-zinc-900 dark:text-beagle-text-heading font-heading font-semibold text-lg">
          Profile
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-16 w-16 rounded-full object-cover border border-zinc-200 dark:border-beagle-border"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-beagle-primary/20 flex items-center justify-center text-beagle-primary font-heading font-semibold text-xl border border-beagle-primary/30">
              {(displayName !== '—' ? displayName : email ?? '?')
                .slice(0, 1)
                .toUpperCase()}
            </div>
          )}
          <div className="space-y-1 min-w-0">
            <p className="text-zinc-900 dark:text-beagle-text-heading font-semibold truncate">{displayName}</p>
            <p className="text-sm text-zinc-600 dark:text-beagle-text-muted truncate">{email ?? 'Not signed in'}</p>
            <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-beagle-border px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:text-beagle-text-muted">
              Role: {role ?? '—'}
            </span>
            {profile?.created_at && (
              <p className="text-xs text-zinc-500 dark:text-beagle-text-faint">
                Member since {new Date(profile.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-beagle-border bg-white dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-white/[0.01] p-6 space-y-6 shadow-sm dark:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-zinc-900 dark:text-beagle-text-heading font-heading font-semibold text-lg">
            Writing &amp; AI
          </h2>
          {saving && (
            <span className="text-xs text-zinc-500 dark:text-beagle-text-muted">Saving…</span>
          )}
        </div>
        {saveError && <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>}

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 dark:text-beagle-text-muted uppercase tracking-wide">
            Default tone
          </label>
          <select
            value={preferences.defaultTone}
            onChange={(e) => updatePreferences({ defaultTone: e.target.value as WritingTone })}
            className="w-full max-w-md bg-zinc-50 dark:bg-beagle-surface border border-zinc-200 dark:border-beagle-border rounded-lg px-3 py-2 text-zinc-900 dark:text-beagle-text-body"
          >
            {TONES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 dark:text-beagle-text-muted uppercase tracking-wide">
            Publication name
          </label>
          <input
            type="text"
            value={preferences.publicationName}
            onChange={(e) => updatePreferences({ publicationName: e.target.value })}
            placeholder="e.g. My weekly AI digest"
            className="w-full bg-zinc-50 dark:bg-beagle-surface border border-zinc-200 dark:border-beagle-border rounded-lg px-3 py-2 text-zinc-900 dark:text-beagle-white placeholder-zinc-400 dark:placeholder-beagle-text-dimmed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 dark:text-beagle-text-muted uppercase tracking-wide">
            Topics of interest
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onBlur={() => commitTags()}
            placeholder="AI, startups, dev tools (comma-separated)"
            className="w-full bg-zinc-50 dark:bg-beagle-surface border border-zinc-200 dark:border-beagle-border rounded-lg px-3 py-2 text-zinc-900 dark:text-beagle-white placeholder-zinc-400 dark:placeholder-beagle-text-dimmed"
          />
          <p className="text-xs text-zinc-500 dark:text-beagle-text-faint">Saved when you leave the field.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 dark:text-beagle-text-muted uppercase tracking-wide">
            LinkedIn profile URL
          </label>
          <input
            type="url"
            value={preferences.linkedinProfileUrl}
            onChange={(e) => updatePreferences({ linkedinProfileUrl: e.target.value })}
            placeholder="https://www.linkedin.com/in/…"
            className="w-full bg-zinc-50 dark:bg-beagle-surface border border-zinc-200 dark:border-beagle-border rounded-lg px-3 py-2 text-zinc-900 dark:text-beagle-white placeholder-zinc-400 dark:placeholder-beagle-text-dimmed"
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.autoSaveEnabled}
            onChange={(e) => updatePreferences({ autoSaveEnabled: e.target.checked })}
            className="rounded border-zinc-300 dark:border-beagle-border"
          />
          <span className="text-sm text-zinc-700 dark:text-beagle-text-body">Enable draft auto-save (editor)</span>
        </label>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-beagle-border bg-white dark:bg-gradient-to-b dark:from-white/[0.04] dark:to-white/[0.01] p-6 space-y-4 shadow-sm dark:shadow-none">
        <h2 className="text-zinc-900 dark:text-beagle-text-heading font-heading font-semibold text-lg">
          Appearance
        </h2>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => updatePreferences({ theme: t.value })}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                preferences.theme === t.value
                  ? 'bg-beagle-primary text-white'
                  : 'bg-zinc-100 dark:bg-beagle-border text-zinc-700 dark:text-beagle-text-muted hover:bg-zinc-200 dark:hover:bg-beagle-border/80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {!skipAuth && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-full px-6 py-3 font-semibold border border-zinc-300 dark:border-beagle-border text-zinc-700 dark:text-beagle-text-muted hover:bg-zinc-100 dark:hover:bg-beagle-primary-ghost hover:text-beagle-primary transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </motion.section>
  )
}
