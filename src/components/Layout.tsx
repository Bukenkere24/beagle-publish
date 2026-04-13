import { Link, Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutList, FileEdit, Settings, LogOut, Shield, Moon, Sun, Monitor } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { usePreferences } from '../contexts/PreferencesContext'

export default function Layout() {
  const { user, signOut, isAdmin } = useAuth()
  const { preferences, toggleTheme } = usePreferences()
  const navigate = useNavigate()
  const location = useLocation()
  const draftsActive = location.pathname.startsWith('/drafts')

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  const ThemeIcon = preferences.theme === 'dark' ? Moon : preferences.theme === 'light' ? Sun : Monitor

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-beagle transition-all font-medium ${
      isActive
        ? 'bg-beagle-primary/10 text-beagle-primary shadow-lg shadow-beagle-primary/5'
        : 'text-beagle-text-muted hover:bg-beagle-surface hover:text-beagle-text-heading'
    }`

  const draftsClass = draftsActive
    ? 'flex items-center gap-3 px-4 py-3 rounded-beagle bg-beagle-primary/10 text-beagle-primary font-medium shadow-lg shadow-beagle-primary/5'
    : 'flex items-center gap-3 px-4 py-3 rounded-beagle text-beagle-text-muted hover:bg-beagle-surface hover:text-beagle-text-heading transition-all font-medium'

  return (
    <div className="flex min-h-screen bg-beagle-bg">
      <aside className="flex w-64 shrink-0 flex-col border-r border-beagle-border beagle-glass">
        <div className="border-b border-beagle-border p-6 flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-full.svg" alt="Beagle" className="w-32" />
          </Link>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-beagle-text-muted font-bold uppercase tracking-widest">Publish SaaS</p>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-beagle bg-beagle-surface border border-beagle-border text-beagle-text-muted hover:text-beagle-primary transition-all"
              title={`Theme: ${preferences.theme}`}
            >
              <ThemeIcon size={14} />
            </button>
          </div>
        </div>
        <nav className="flex-1 space-y-2 p-6">
          <NavLink to="/topics" className={linkClass} end>
            <LayoutList size={20} strokeWidth={1.5} />
            Topics
          </NavLink>
          <Link to="/topics" className={draftsClass}>
            <FileEdit size={20} strokeWidth={1.5} />
            Drafts
          </Link>
          <NavLink to="/settings" className={linkClass}>
            <Settings size={20} strokeWidth={1.5} />
            Settings
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              <Shield size={20} strokeWidth={1.5} />
              Admin Panel
            </NavLink>
          )}
        </nav>
        <div className="border-t border-beagle-border p-4 text-sm">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-beagle-primary/10 flex items-center justify-center text-beagle-primary font-bold text-xs">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-beagle-text-heading font-bold text-xs truncate" title={user?.email ?? ''}>
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-beagle-text-dimmed text-[10px] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="flex w-full items-center gap-2 rounded-beagle px-3 py-2 text-left text-beagle-text-muted hover:bg-beagle-error/5 hover:text-beagle-error transition-all font-semibold text-xs"
          >
            <LogOut size={14} strokeWidth={2} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
