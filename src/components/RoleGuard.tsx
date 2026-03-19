import type { ReactNode } from 'react'

export default function RoleGuard({
  allowed,
  reason = 'Requires admin approval',
  children,
}: {
  allowed: boolean
  reason?: string
  children: ReactNode
}) {
  return (
    <div
      className={!allowed ? 'opacity-60 cursor-not-allowed' : undefined}
      title={!allowed ? reason : undefined}
    >
      {children}
    </div>
  )
}

