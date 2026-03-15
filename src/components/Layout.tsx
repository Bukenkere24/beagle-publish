import { Outlet, NavLink } from 'react-router-dom'
import { LayoutList, FileEdit, Settings } from 'lucide-react'

export default function Layout() {
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
          User info
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
