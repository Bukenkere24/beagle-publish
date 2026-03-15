import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import TopicCard from '../components/TopicCard'
import AddTopicModal from '../components/AddTopicModal'
import type { TopicRow, TopicStatus } from '../types/topic'

const FILTERS: { value: 'all' | TopicStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'queued', label: 'Queued' },
  { value: 'review', label: 'In Review' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
]

export default function TopicsPage() {
  const navigate = useNavigate()
  const [topics, setTopics] = useState<TopicRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | TopicStatus>('all')
  const [addModalOpen, setAddModalOpen] = useState(false)

  const fetchTopics = async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('blog_topic_queue')
        .select('*')
        .order('created_at', { ascending: false })
      if (activeFilter !== 'all') {
        query = query.eq('status', activeFilter)
      }
      const { data, err } = await query
      if (err) throw err
      setTopics((data as TopicRow[]) ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load topics')
      setTopics([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [activeFilter])

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-beagle mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-beagle-text-heading font-heading font-semibold text-4xl">
          Topics Queue
        </h1>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-beagle-primary text-white rounded-beagle-btn px-6 py-3 uppercase tracking-wider font-medium hover:bg-beagle-primary-hover transition-colors"
        >
          <Plus size={18} strokeWidth={1} />
          Add Topic
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-beagle-border-section pb-4">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveFilter(value)}
            className={`px-4 py-2 rounded-beagle text-sm font-medium transition-colors ${
              activeFilter === value
                ? 'bg-beagle-primary text-white'
                : 'bg-beagle-surface border border-beagle-border text-beagle-text-muted hover:text-beagle-text-body hover:border-beagle-border-hover'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-red-400 mb-4">{error}</p>
      )}

      {loading ? (
        <p className="text-beagle-text-muted">Loading topics…</p>
      ) : topics.length === 0 ? (
        <p className="text-beagle-text-muted">
          No topics yet. Add one with the button above or wait for the n8n pipeline.
        </p>
      ) : (
        <div className="grid gap-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onClick={() => navigate(`/drafts/${topic.id}`)}
            />
          ))}
        </div>
      )}

      <AddTopicModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdded={fetchTopics}
      />
    </motion.section>
  )
}
