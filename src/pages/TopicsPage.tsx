import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, FileText, LayoutDashboard, CheckCircle, Clock as ClockIcon } from 'lucide-react'
import { getTopics } from '../lib/db/topics'
import { useAuth } from '../hooks/useAuth'
import TopicCard from '../components/TopicCard'
import AddTopicModal from '../components/AddTopicModal'
import type { TopicRow, TopicStatus } from '../types/topic'

const FILTERS: { value: 'all' | TopicStatus; label: string }[] = [
  { value: 'all', label: 'All Content' },
  { value: 'queued', label: 'Queued' },
  { value: 'review', label: 'In Review' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
]

export default function TopicsPage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [topics, setTopics] = useState<TopicRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | TopicStatus>('all')
  const [addModalOpen, setAddModalOpen] = useState(false)

  const isAdmin = profile?.role === 'admin'

  const stats = useMemo(() => {
    return {
      total: topics.length,
      inProgress: topics.filter(t => ['queued', 'drafting', 'review'].includes(t.status)).length,
      published: topics.filter(t => t.status === 'published').length,
    }
  }, [topics])

  const fetchTopics = async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const data = await getTopics(user.id, isAdmin)
      
      let filteredData = data
      if (activeFilter !== 'all') {
        filteredData = filteredData.filter((t: TopicRow) => t.status === activeFilter)
      }
      
      setTopics(filteredData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load topics')
      setTopics([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [activeFilter, user, profile])

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-beagle mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-beagle-text-heading font-heading font-bold text-4xl mb-2 tracking-tight">
            Content Pipeline
          </h1>
          <p className="text-beagle-text-muted text-sm font-medium">
            Manage your blog topics and AI-powered drafts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center gap-2.5 bg-beagle-primary text-white rounded-full px-8 py-3.5 font-semibold hover:bg-beagle-primary-hover transition-all duration-300 shadow-lg shadow-beagle-primary/20"
        >
          <Plus size={20} strokeWidth={2.5} />
          <span>New Topic</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Total Topics', value: stats.total, icon: LayoutDashboard, color: 'text-beagle-primary' },
          { label: 'In Progress', value: stats.inProgress, icon: ClockIcon, color: 'text-beagle-warning' },
          { label: 'Published', value: stats.published, icon: CheckCircle, color: 'text-beagle-success' },
        ].map((stat) => (
          <div key={stat.label} className="beagle-glass border border-beagle-border rounded-xl p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-beagle-surface border border-beagle-border ${stat.color}`}>
              <stat.icon size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="text-beagle-text-muted text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
              <p className="text-beagle-text-heading text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-beagle-border pb-4">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveFilter(value)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 uppercase tracking-widest ${
              activeFilter === value
                ? 'bg-beagle-primary text-white shadow-md'
                : 'bg-transparent border border-transparent text-beagle-text-muted hover:text-beagle-text-heading hover:border-beagle-border'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-beagle-error/10 border border-beagle-error/20 text-beagle-error p-4 rounded-xl mb-6 flex items-center gap-3">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beagle-primary mb-4" />
          <p className="text-beagle-text-muted font-medium">Synchronizing content...</p>
        </div>
      ) : topics.length === 0 ? (
        <div className="beagle-glass border border-beagle-border rounded-2xl p-16 flex flex-col items-center text-center">
          <div className="bg-beagle-surface border border-beagle-border p-5 rounded-2xl mb-6 text-beagle-text-muted opacity-40">
            <FileText size={48} strokeWidth={1} />
          </div>
          <h3 className="text-beagle-text-heading font-heading text-2xl font-bold mb-3">
            {activeFilter === 'all' ? 'Your content pipeline is empty' : `No ${activeFilter} topics found`}
          </h3>
          <p className="text-beagle-text-muted max-w-md mx-auto mb-8 font-medium leading-relaxed">
            {activeFilter === 'all' 
              ? 'Start by creating your first topic. Our AI engine will help you transform it into a professional blog post.'
              : `You don't have any topics with the status "${activeFilter}" right now.`}
          </p>
          {activeFilter === 'all' && (
            <button
              onClick={() => setAddModalOpen(true)}
              className="bg-beagle-primary text-white rounded-full px-8 py-3.5 font-bold hover:bg-beagle-primary-hover transition-all duration-300"
            >
              Get Started
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
