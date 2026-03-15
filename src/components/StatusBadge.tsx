const statusStyles: Record<string, string> = {
  queued: 'bg-zinc-800 text-beagle-text-muted',
  drafting: 'bg-zinc-800 text-beagle-text-muted',
  review: 'bg-yellow-500/20 text-yellow-400',
  published: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
  archived: 'bg-beagle-border text-beagle-text-dimmed',
}

const statusLabels: Record<string, string> = {
  queued: 'Queued',
  drafting: 'Drafting',
  review: 'In Review',
  published: 'Published',
  rejected: 'Rejected',
  archived: 'Archived',
}

export default function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? statusStyles.queued
  const label = statusLabels[status] ?? status
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${style}`}
    >
      {label}
    </span>
  )
}
