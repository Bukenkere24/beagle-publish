import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle, Loader2 } from 'lucide-react'

type IconCircleProps = {
  icon: LucideIcon
  variant?: 'primary' | 'muted' | 'danger'
}

function IconCircle({ icon: Icon, variant = 'primary' }: IconCircleProps) {
  const bg =
    variant === 'danger'
      ? 'bg-red-500/10'
      : variant === 'muted'
        ? 'bg-beagle-border/50'
        : 'bg-beagle-primary/10'
  const color =
    variant === 'danger'
      ? 'text-red-400'
      : variant === 'muted'
        ? 'text-beagle-text-muted'
        : 'text-beagle-primary'

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full ${bg}`}
    >
      <Icon className={`h-8 w-8 ${color}`} strokeWidth={1.5} />
    </motion.div>
  )
}

export function PageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2
        className="mb-4 h-9 w-9 animate-spin text-beagle-primary"
        strokeWidth={1.5}
        aria-hidden
      />
      <p className="text-sm text-beagle-text-muted">{label}</p>
    </motion.div>
  )
}

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <IconCircle icon={icon} />
      <h2 className="mb-2 font-heading text-lg font-semibold text-beagle-text-heading">
        {title}
      </h2>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-beagle-text-muted">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="rounded-beagle-btn bg-beagle-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-beagle-primary-hover"
          >
            {action.label}
          </button>
        )}
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="rounded-beagle-btn border border-beagle-border px-6 py-3 text-sm font-medium text-beagle-text-body transition-colors hover:border-beagle-border-hover hover:bg-beagle-surface"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </motion.div>
  )
}

type ErrorStateProps = {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn’t load your data. Check your connection and try again.',
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
      role="alert"
    >
      <IconCircle icon={AlertCircle} variant="danger" />
      <h2 className="mb-2 font-heading text-lg font-semibold text-beagle-text-heading">
        {title}
      </h2>
      <p className="mb-6 max-w-sm text-sm text-beagle-text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-beagle-btn border border-beagle-border px-5 py-2.5 text-sm text-beagle-text-heading transition-colors hover:border-beagle-border-hover hover:bg-beagle-surface"
        >
          {retryLabel}
        </button>
      )}
    </motion.div>
  )
}
