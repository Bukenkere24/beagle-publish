import { useState } from 'react'
import { Link, Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutList, Settings, LogOut, Menu, X, Sparkles, Rocket } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const draftsActive = location.pathname.startsWith('/drafts')
  const aiActive = location.search.includes('intent=ai')
  const publishActive = location.search.includes('intent=publish')

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-beagle px-4 py-3 transition-colors ${
      isActive
        ? 'bg-beagle-primary-ghost text-beagle-primary'
        : 'text-beagle-text-muted hover:bg-beagle-border hover:text-beagle-text-body'
    }`

  const staticLinkClass = (active: boolean) =>
    `flex items-center gap-3 rounded-beagle px-4 py-3 transition-colors ${
      active
        ? 'bg-beagle-primary-ghost text-beagle-primary'
        : 'text-beagle-text-muted hover:bg-beagle-border hover:text-beagle-text-body'
    }`

  const sidebar = (
    <>
      <div className="border-b border-beagle-border p-4 sm:p-6">
        <h1 className="font-heading text-base font-semibold text-beagle-text-heading sm:text-lg">
          Blog Command Center
        </h1>
      </div>
      <nav className="flex-1 space-y-1 p-3 sm:p-4">
        <NavLink to="/topics" className={linkClass} end onClick={() => setMobileOpen(false)}>
          <LayoutList size={20} strokeWidth={1} />
          Topics
        </NavLink>
        <Link
          to="/topics?intent=ai"
          className={staticLinkClass(aiActive)}
          onClick={() => setMobileOpen(false)}
        >
          <Sparkles size={20} strokeWidth={1} />
          AI Generator
        </Link>
        <Link
          to="/topics?intent=publish"
          className={staticLinkClass(publishActive || draftsActive)}
          onClick={() => setMobileOpen(false)}
        >
          <Rocket size={20} strokeWidth={1} />
          Publish
        </Link>
        <NavLink to="/settings" className={linkClass} onClick={() => setMobileOpen(false)}>
          <Settings size={20} strokeWidth={1} />
          Settings
        </NavLink>
      </nav>
      <div className="border-t border-beagle-border p-3 text-sm text-beagle-text-dimmed sm:p-4">
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
    </>
  )

  return (
    <div className="flex min-h-screen bg-beagle-bg">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-beagle-border bg-beagle-surface md:flex">
        {sidebar}
      </aside>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[min(280px,85vw)] flex-col border-r border-beagle-border bg-beagle-surface md:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 z-10 rounded-beagle p-2 text-beagle-text-muted hover:bg-beagle-border"
            >
              <X size={20} strokeWidth={1} />
            </button>
            {sidebar}
          </aside>
        </>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-beagle-border bg-beagle-surface px-4 md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-beagle p-2 text-beagle-text-muted hover:bg-beagle-border"
          >
            <Menu size={22} strokeWidth={1} />
          </button>
          <span className="truncate font-heading text-sm font-semibold text-beagle-text-heading">
            Blog Command Center
          </span>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
