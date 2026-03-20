import { Link, Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutList, FileEdit, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const draftsActive = location.pathname.startsWith('/drafts')

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-beagle transition-colors ${
      isActive
        ? 'bg-beagle-primary-ghost text-beagle-primary'
        : 'text-beagle-text-muted hover:bg-beagle-border hover:text-beagle-text-body'
    }`

  const draftsClass = draftsActive
    ? 'flex items-center gap-3 px-4 py-3 rounded-beagle bg-beagle-primary-ghost text-beagle-primary'
    : 'flex items-center gap-3 px-4 py-3 rounded-beagle text-beagle-text-muted hover:bg-beagle-border hover:text-beagle-text-body'

  return (
    <div className="flex min-h-screen bg-beagle-bg">
      <aside className="flex w-56 shrink-0 flex-col border-r border-beagle-border bg-beagle-surface">
        <div className="border-b border-beagle-border p-6">
          <h1 className="font-heading text-lg font-semibold text-beagle-text-heading">
            Blog Command Center
          </h1>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavLink to="/topics" className={linkClass} end>
            <LayoutList size={20} strokeWidth={1} />
            Topics
          </NavLink>
          <Link to="/topics" className={draftsClass}>
            <FileEdit size={20} strokeWidth={1} />
            Drafts
          </Link>
          <NavLink to="/settings" className={linkClass}>
            <Settings size={20} strokeWidth={1} />
            Settings
          </NavLink>
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
