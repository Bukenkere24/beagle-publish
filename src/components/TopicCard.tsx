import { motion } from 'framer-motion'
import StatusBadge from './StatusBadge'

type Topic = {
  id: string
  topic: string
  status: string
  source: string
  relevance_score?: number
  keywords?: string[]
  created_at: string
}

export default function TopicCard({
  topic,
  onClick,
}: {
  topic: Topic
  onClick: () => void
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClick}
      className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-beagle-border rounded-beagle p-6 cursor-pointer hover:border-beagle-border-hover transition-colors"
    >
      <p className="text-beagle-text-body line-clamp-2 mb-2">{topic.topic}</p>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={topic.status} />
        <span className="text-beagle-text-dimmed text-sm">{topic.source}</span>
        {topic.relevance_score != null && (
          <span className="text-beagle-text-muted text-sm">
            {Math.round((topic.relevance_score ?? 0) * 100)}%
          </span>
        )}
        <span className="text-beagle-text-faint text-sm">
          {new Date(topic.created_at).toLocaleDateString()}
        </span>
      </div>
    </motion.article>
  )
}
