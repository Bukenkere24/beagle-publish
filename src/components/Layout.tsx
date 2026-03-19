import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutList, FileEdit, Settings } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Layout() {
  const navigate = useNavigate()
  const { user, profile, canPublish, signOut, skipAuth } = useAuth()

  const displayEmail = profile?.email ?? user?.email ?? (skipAuth ? 'dev@local' : null)
  const displayRole = profile?.role ?? (skipAuth ? 'admin' : null)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-beagle-bg">
      <aside className="w-56 shrink-0 bg-beagle-surface border-r border-beagle-border flex flex-col">
        <div className="p-6 border-b border-beagle-border">
          <h1 className="text-beagle-text-heading font-heading font-semibold text-lg">
            Blog Command Center
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/topics"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-beagle transition-colors ${
                isActive
                  ? 'bg-beagle-primary-ghost text-beagle-primary'
                  : 'text-beagle-text-muted hover:bg-beagle-border hover:text-beagle-text-body'
              }`
            }
          >
            <LayoutList size={20} strokeWidth={1} />
            Topics
          </NavLink>
          <NavLink
            to="/drafts"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-beagle transition-colors ${
                isActive
                  ? 'bg-beagle-primary-ghost text-beagle-primary'
                  : 'text-beagle-text-muted hover:bg-beagle-border hover:text-beagle-text-body'
              }`
            }
          >
            <FileEdit size={20} strokeWidth={1} />
            Drafts
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-beagle transition-colors ${
                isActive
                  ? 'bg-beagle-primary-ghost text-beagle-primary'
                  : 'text-beagle-text-muted hover:bg-beagle-border hover:text-beagle-text-body'
              }`
            }
          >
            <Settings size={20} strokeWidth={1} />
            Settings
          </NavLink>
        </nav>
        <div className="p-4 border-t border-beagle-border text-beagle-text-dimmed text-sm">
          <div className="space-y-2">
            <div>
              <p className="text-beagle-text-muted text-xs uppercase tracking-widest font-semibold">Signed in</p>
              <p className="text-beagle-text-body text-sm truncate">{displayEmail ?? '—'}</p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-beagle-text-muted">Role</span>
              <span className="text-xs px-2 py-1 rounded bg-beagle-border text-beagle-text-muted">
                {displayRole ?? '—'}
              </span>
            </div>
            {!skipAuth && (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full rounded-beagle-btn px-3 py-2 uppercase tracking-wider font-medium border border-beagle-border text-beagle-text-muted hover:bg-beagle-primary-ghost hover:text-beagle-primary hover:border-beagle-primary transition-colors"
              >
                Sign out
              </button>
            )}
            {!canPublish && (
              <p className="text-xs text-beagle-text-faint">
                Publish actions require admin approval.
              </p>
            )}
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
