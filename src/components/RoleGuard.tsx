import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: ('admin' | 'editor')[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { profile, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-beagle-text-muted">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Checking permissions...</p>
      </div>
    )
  }

  // Admin bypass
  if (isAdmin) return <>{children}</>

  if (!profile || !allowedRoles.includes(profile.role)) {
    return <Navigate to="/topics" replace />
  }

  return <>{children}</>
}

interface AdminPublishButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function AdminPublishButton({ children, ...props }: AdminPublishButtonProps) {
  const { isAdmin, loading } = useAuth()

  if (loading) return null
  if (!isAdmin) return null

  return <button {...props}>{children}</button>
}
