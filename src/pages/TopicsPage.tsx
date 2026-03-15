import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import TopicCard from '../components/TopicCard'
import StatusBadge from '../components/StatusBadge'

export default function TopicsPage() {
  const navigate = useNavigate()
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-beagle mx-auto"
    >
      <h1 className="text-beagle-text-heading font-heading font-semibold text-4xl mb-8">
        Topics Queue
      </h1>
      <p className="text-beagle-text-muted mb-6">
        Topics list will load from blog_topic_queue. Filter tabs and Add Topic in BP-402.
      </p>
      <div className="flex gap-2 mb-6">
        <StatusBadge status="queued" />
        <StatusBadge status="review" />
        <StatusBadge status="published" />
        <StatusBadge status="rejected" />
      </div>
      <div className="grid gap-4">
        <TopicCard
          topic={{ id: '1', topic: 'Placeholder topic from BP-401', status: 'queued', source: 'manual', relevance_score: 0.85, keywords: [], created_at: new Date().toISOString() }}
          onClick={() => navigate('/drafts/1')}
        />
      </div>
    </motion.section>
  )
}
