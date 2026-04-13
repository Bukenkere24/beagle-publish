import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutList, FileEdit, Moon, Settings, Sun, SunMoon } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useThemeToggle } from '../hooks/usePreferences'

export default function Layout() {
  const navigate = useNavigate()
  const { user, profile, canPublish, signOut, skipAuth } = useAuth()
  const { theme, cycleTheme } = useThemeToggle()

  const displayEmail = profile?.email ?? user?.email ?? (skipAuth ? 'dev@local' : null)
  const displayRole = profile?.role ?? (skipAuth ? 'admin' : null)
  const displayName = profile?.full_name ?? displayEmail ?? 'User'
  const avatarUrl = profile?.avatar_url

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : SunMoon

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-beagle-bg text-zinc-900 dark:text-beagle-text-body">
      <aside className="w-56 shrink-0 bg-white dark:bg-beagle-surface border-r border-zinc-200 dark:border-beagle-border flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-beagle-border">
          <h1 className="text-zinc-900 dark:text-beagle-text-heading font-heading font-semibold text-lg">
            Beagle Publish
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/topics"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-beagle-primary-ghost text-beagle-primary'
                  : 'text-zinc-600 dark:text-beagle-text-muted hover:bg-zinc-100 dark:hover:bg-beagle-border hover:text-zinc-900 dark:hover:text-beagle-text-body'
              }`
            }
          >
            <LayoutList size={20} strokeWidth={1} />
            Topics
          </NavLink>
          <NavLink
            to="/drafts"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-beagle-primary-ghost text-beagle-primary'
                  : 'text-zinc-600 dark:text-beagle-text-muted hover:bg-zinc-100 dark:hover:bg-beagle-border hover:text-zinc-900 dark:hover:text-beagle-text-body'
              }`
            }
          >
            <FileEdit size={20} strokeWidth={1} />
            Drafts
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-beagle-primary-ghost text-beagle-primary'
                  : 'text-zinc-600 dark:text-beagle-text-muted hover:bg-zinc-100 dark:hover:bg-beagle-border hover:text-zinc-900 dark:hover:text-beagle-text-body'
              }`
            }
          >
            <Settings size={20} strokeWidth={1} />
            Settings
          </NavLink>
        </nav>
        <div className="p-4 border-t border-zinc-200 dark:border-beagle-border text-sm">
          <div className="flex items-center gap-3 mb-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-10 w-10 rounded-full object-cover border border-zinc-200 dark:border-beagle-border shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-beagle-primary/15 flex items-center justify-center text-beagle-primary font-heading font-semibold text-sm border border-beagle-primary/25 shrink-0">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-zinc-900 dark:text-beagle-text-body text-sm font-medium truncate">
                {displayName}
              </p>
              <p className="text-zinc-500 dark:text-beagle-text-muted text-xs truncate">{displayEmail ?? '—'}</p>
            </div>
            <button
              type="button"
              onClick={cycleTheme}
              className="shrink-0 p-2 rounded-lg border border-zinc-200 dark:border-beagle-border text-zinc-600 dark:text-beagle-text-muted hover:bg-zinc-100 dark:hover:bg-beagle-border hover:text-beagle-primary transition-colors"
              title={`Theme: ${theme} (click to cycle)`}
              aria-label={`Theme: ${theme}. Click to cycle.`}
            >
              <ThemeIcon size={18} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-zinc-500 dark:text-beagle-text-muted uppercase tracking-wide">
              Role
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-zinc-100 dark:bg-beagle-border text-zinc-700 dark:text-beagle-text-muted">
              {displayRole ?? '—'}
            </span>
          </div>
          {!skipAuth && (
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full rounded-full px-3 py-2 font-semibold text-sm border border-zinc-200 dark:border-beagle-border text-zinc-600 dark:text-beagle-text-muted hover:bg-zinc-100 dark:hover:bg-beagle-primary-ghost hover:text-beagle-primary hover:border-beagle-primary transition-colors"
            >
              Sign out
            </button>
          )}
          {!canPublish && (
            <p className="text-xs text-zinc-500 dark:text-beagle-text-faint mt-2">
              Publish actions require admin approval.
            </p>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
