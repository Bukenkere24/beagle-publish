import { Link, Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutList, FileEdit, Settings, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Layout() {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const draftsActive = location.pathname.startsWith('/drafts')

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

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
        <div className="border-b border-beagle-border p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-beagle-primary animate-pulse" />
            <h1 className="font-heading text-lg font-bold text-beagle-text-heading uppercase tracking-widest">
              Beagle
            </h1>
          </div>
          <p className="text-[10px] text-beagle-text-muted font-bold uppercase tracking-widest">Publish SaaS</p>
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
        <div className="border-t border-beagle-border p-4 text-sm text-beagle-text-dimmed">
          <p className="truncate" title={user?.email ?? ''}>
            {user?.email ?? 'Signed in'}
          </p>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="mt-2 flex w-full items-center gap-2 rounded-beagle px-2 py-2 text-left text-beagle-text-muted hover:bg-beagle-border/50"
          >
            <LogOut size={16} strokeWidth={1} />
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
