import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user, loading } = useAuth()
  const skipAuth =
    import.meta.env.VITE_DEV_SKIP_AUTH === 'true' ||
    import.meta.env.VITE_DEV_SKIP_AUTH === '1'

  if (skipAuth) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-beagle-bg">
        <p className="text-beagle-text-muted">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
