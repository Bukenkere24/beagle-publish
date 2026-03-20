import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { formatScheduledAt } from '../lib/time'
import type { TopicRow } from '../types/topic'

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const sec = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (sec < 60) return 'just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.floor(hr / 24)
  if (d < 7) return `${d}d ago`
  return date.toLocaleDateString()
}

export default function TopicCard({
  topic,
  onClick,
}: {
  topic: TopicRow
  onClick: () => void
}) {
  const score = topic.relevance_score != null ? Math.round(topic.relevance_score * 100) : null
  const keywords = topic.keywords ?? []

  return (
    <motion.article
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClick}
      className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-beagle-border rounded-beagle p-6 cursor-pointer hover:border-beagle-border-hover transition-colors"
    >
      <p className="text-beagle-text-body line-clamp-2 mb-3">{topic.topic}</p>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <StatusBadge status={topic.status} />
        <span className="text-beagle-text-dimmed text-sm capitalize">{topic.source}</span>
        {topic.scheduled_publish_at && topic.status === 'review' && (
          <span className="inline-flex items-center gap-1 text-beagle-text-muted text-xs">
            <Clock size={12} strokeWidth={1} aria-hidden />
            {formatScheduledAt(topic.scheduled_publish_at)}
          </span>
        )}
        {score != null && (
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-beagle-border rounded-full overflow-hidden">
              <div
                className="h-full bg-beagle-primary rounded-full"
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-beagle-text-muted text-sm">{score}%</span>
          </div>
        )}
        <span className="text-beagle-text-faint text-sm ml-auto">
          {relativeTime(topic.created_at)}
        </span>
      </div>
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {keywords.slice(0, 5).map((k) => (
            <span
              key={k}
              className="px-2 py-0.5 rounded text-xs bg-beagle-border text-beagle-text-muted"
            >
              {k}
            </span>
          ))}
          {keywords.length > 5 && (
            <span className="text-beagle-text-faint text-xs">+{keywords.length - 5}</span>
          )}
        </div>
      )}
    </motion.article>
  )
}
