import { motion } from 'framer-motion'
import StatusBadge from './StatusBadge'
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
      className="beagle-glass border border-beagle-border rounded-beagle p-6 cursor-pointer hover:border-beagle-border-hover hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      <p className="text-beagle-text-heading font-heading text-lg line-clamp-2 mb-3 leading-snug">{topic.topic}</p>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <StatusBadge status={topic.status} />
        <span className="text-beagle-text-muted text-xs font-medium uppercase tracking-wider">{topic.source}</span>
        {score != null && (
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-16 h-1.5 bg-beagle-border rounded-full overflow-hidden">
              <div
                className="h-full bg-beagle-primary rounded-full transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-beagle-text-muted text-xs font-medium">{score}%</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between border-t border-beagle-border pt-4">
        {keywords.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {keywords.slice(0, 3).map((k) => (
              <span
                key={k}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-beagle-surface text-beagle-text-muted border border-beagle-border"
              >
                {k}
              </span>
            ))}
            {keywords.length > 3 && (
              <span className="text-beagle-text-muted text-[10px] font-medium">+{keywords.length - 3} more</span>
            )}
          </div>
        ) : <div />}
        <span className="text-beagle-text-muted text-xs font-medium">
          {relativeTime(topic.created_at)}
        </span>
      </div>
    </motion.article>
  )
}
