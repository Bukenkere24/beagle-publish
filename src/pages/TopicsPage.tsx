import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FilterX, Inbox, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import TopicCard from '../components/TopicCard'
import AddTopicModal from '../components/AddTopicModal'
import { EmptyState, ErrorState, PageLoader } from '../components/ui/PageState'
import type { TopicRow, TopicStatus } from '../types/topic'

const FILTERS: { value: 'all' | TopicStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'queued', label: 'Queued' },
  { value: 'review', label: 'In Review' },
  { value: 'published', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
]

function draftPath(topicId: string, intent: string | null): string {
  if (intent === 'ai') return `/drafts/${topicId}?tab=linkedin`
  if (intent === 'publish') return `/drafts/${topicId}?section=publish`
  return `/drafts/${topicId}`
}

function pickTopicForIntent(topics: TopicRow[], intent: string | null): TopicRow | null {
  if (!topics.length || !intent) return null
  if (intent === 'ai') {
    return topics.find((t) => t.draft_content?.trim()) ?? topics[0]
  }
  if (intent === 'publish') {
    return (
      topics.find((t) => t.status === 'review' && t.draft_content?.trim()) ??
      topics.find((t) => t.draft_content?.trim()) ??
      topics[0]
    )
  }
  return null
}

export default function TopicsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const intent = searchParams.get('intent')

  const [topics, setTopics] = useState<TopicRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | TopicStatus>('all')
  const [addModalOpen, setAddModalOpen] = useState(false)

  const fetchTopics = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      let query = supabase
        .from('blog_topic_queue')
        .select('*')
        .order('created_at', { ascending: false })
      if (activeFilter !== 'all') {
        query = query.eq('status', activeFilter)
      }
      const { data, error: qError } = await query
      if (qError) throw qError
      setTopics((data as TopicRow[]) ?? [])
    } catch {
      setError(true)
      setTopics([])
    } finally {
      setLoading(false)
    }
  }, [activeFilter])

  useEffect(() => {
    void fetchTopics()
  }, [fetchTopics])

  useEffect(() => {
    if (loading || !intent || topics.length === 0) return
    const target = pickTopicForIntent(topics, intent)
    if (target) {
      navigate(draftPath(target.id, intent), { replace: true })
    }
  }, [loading, intent, topics, navigate])

  const handleTopicClick = (topic: TopicRow) => {
    navigate(draftPath(topic.id, intent))
  }

  const openCreateModal = () => setAddModalOpen(true)
  const isFiltered = activeFilter !== 'all'

  const intentHint =
    intent === 'ai'
      ? 'Select a topic with blog content to open the AI LinkedIn generator.'
      : intent === 'publish'
        ? 'Select a topic to open publishing controls.'
        : null

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-beagle"
    >
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-3xl font-semibold text-beagle-text-heading sm:text-4xl">
          Topics Queue
        </h1>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex w-full items-center justify-center gap-2 rounded-beagle-btn bg-beagle-primary px-6 py-3 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-beagle-primary-hover sm:w-auto"
        >
          <Plus size={18} strokeWidth={1} />
          Add Topic
        </button>
      </div>

      {intentHint && !loading && !error && (
        <p className="mb-4 rounded-beagle border border-beagle-primary/30 bg-beagle-primary/5 px-4 py-3 text-sm text-beagle-text-body">
          {intentHint}{' '}
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="text-beagle-primary hover:underline"
          >
            Dismiss
          </button>
        </p>
      )}

      <div className="mb-6 flex flex-wrap gap-2 border-b border-beagle-border-section pb-4">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveFilter(value)}
            className={`rounded-beagle px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
              activeFilter === value
                ? 'bg-beagle-primary text-white'
                : 'border border-beagle-border bg-beagle-surface text-beagle-text-muted hover:border-beagle-border-hover hover:text-beagle-text-body'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <PageLoader label="Loading topics…" />
      ) : error ? (
        <ErrorState onRetry={() => void fetchTopics()} />
      ) : topics.length === 0 ? (
        isFiltered ? (
          <EmptyState
            icon={FilterX}
            title="No topics in this view"
            description={`Nothing matches the "${FILTERS.find((f) => f.value === activeFilter)?.label ?? activeFilter}" filter. Try another filter or add a new topic.`}
            secondaryAction={{
              label: 'Show all topics',
              onClick: () => setActiveFilter('all'),
            }}
            action={{
              label: 'Add topic',
              onClick: openCreateModal,
            }}
          />
        ) : (
          <EmptyState
            icon={Inbox}
            title="Your content pipeline is empty"
            description="Create your first topic to start generating AI-powered blog drafts and LinkedIn posts."
            action={{
              label: 'Create your first topic',
              onClick: openCreateModal,
            }}
          />
        )
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onClick={() => handleTopicClick(topic)}
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
