import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'

type RoleGuardRenderProps = {
  isAdmin: boolean
  isLoading: boolean
}

/** Render-prop: custom UI for editors vs admins (BP-407). */
export function RoleGuard({
  children,
}: {
  children: (props: RoleGuardRenderProps) => ReactNode
}) {
  const { profile, loading } = useAuth()
  const isAdmin = profile?.role === 'admin'
  return <>{children({ isAdmin, isLoading: loading })}</>
}

type AdminPublishButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

/**
 * Publish / reject / destructive actions: disabled for editors with tooltip.
 */
export function AdminPublishButton({
  children,
  disabled,
  title,
  className = '',
  ...rest
}: AdminPublishButtonProps) {
  const { profile, loading } = useAuth()
  const isAdmin = profile?.role === 'admin'
  const blocked = loading || !isAdmin
  const needsApproval = !loading && !isAdmin

  return (
    <button
      type="button"
      {...rest}
      disabled={disabled || blocked}
      title={
        needsApproval ? 'Requires admin approval' : title
      }
      className={className}
    >
      {children}
    </button>
  )
}
