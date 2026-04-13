import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { skipAuth, user, loading } = useAuth()
  const location = useLocation()

  if (loading && !skipAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-beagle-bg">
        <p className="text-zinc-600 dark:text-beagle-text-muted">Loading…</p>
      </div>
    )
  }

  if (!skipAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
