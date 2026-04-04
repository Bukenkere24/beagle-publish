const statusStyles: Record<string, string> = {
  queued: 'bg-beagle-surface text-beagle-text-muted border border-beagle-border',
  drafting: 'bg-beagle-surface text-beagle-text-muted border border-beagle-border',
  review: 'bg-beagle-warning/10 text-beagle-warning border border-beagle-warning/30',
  published: 'bg-beagle-success/10 text-beagle-success border border-beagle-success/30',
  rejected: 'bg-beagle-error/10 text-beagle-error border border-beagle-error/30',
  archived: 'bg-beagle-border text-beagle-text-muted',
}

const statusLabels: Record<string, string> = {
  queued: 'Queued',
  drafting: 'Drafting',
  review: 'In Review',
  published: 'Published',
  rejected: 'Rejected',
  archived: 'Archived',
}

export default function StatusBadge({ status, className = '' }: { status: string; className?: string }) {
  const style = statusStyles[status] ?? statusStyles.queued
  const label = statusLabels[status] ?? status
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${style} ${className}`}
    >
      {label}
    </span>
  )
}
