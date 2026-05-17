import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { TopicRow } from '../types/topic'
import DraftEditor from '../components/DraftEditor'
import DraftMetadata from '../components/DraftMetadata'
import PublishControls from '../components/PublishControls'
import SchedulePublish from '../components/SchedulePublish'
import { EmptyState, ErrorState, PageLoader } from '../components/ui/PageState'

export default function DraftEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const initialTab = tabParam === 'linkedin' ? 'linkedin' : 'blog'
  const scrollToPublish = searchParams.get('section') === 'publish'

  const publishRef = useRef<HTMLDivElement>(null)
  const [topic, setTopic] = useState<TopicRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const fetchTopic = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(false)
    setNotFound(false)
    try {
      const { data, error: qError } = await supabase
        .from('blog_topic_queue')
        .select('*')
        .eq('id', id)
        .single()

      if (qError) {
        if (qError.code === 'PGRST116') {
          setNotFound(true)
          setTopic(null)
          return
        }
        throw qError
      }
      setTopic(data as TopicRow)
    } catch {
      setError(true)
      setTopic(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void fetchTopic()
  }, [fetchTopic])

  useEffect(() => {
    if (!scrollToPublish || loading || !topic) return
    const t = window.setTimeout(() => {
      publishRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
    return () => window.clearTimeout(t)
  }, [scrollToPublish, loading, topic])

  const handleUpdate = async (updates: Partial<TopicRow>) => {
    if (!id || !topic) return

    setTopic((prev) => (prev ? { ...prev, ...updates } : null))

    setSaving(true)
    try {
      const { error: saveError } = await supabase
        .from('blog_topic_queue')
        .update(updates)
        .eq('id', id)

      if (saveError) throw saveError
      setLastSaved(new Date())
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <PageLoader label="Loading draft…" />
  }

  if (error) {
    return (
      <motion.div className="mx-auto max-w-beagle">
        <ErrorState
          title="Couldn't load this draft"
          message="Something went wrong while fetching this topic. Your work is safe — try again in a moment."
          onRetry={() => void fetchTopic()}
        />
      </motion.div>
    )
  }

  if (notFound || !topic) {
    return (
      <motion.div className="mx-auto max-w-beagle">
        <EmptyState
          icon={FileQuestion}
          title="Draft not found"
          description="This topic may have been removed or the link is incorrect. Head back to your queue to pick another draft."
          action={{
            label: 'Back to topics',
            onClick: () => navigate('/topics'),
          }}
        />
      </motion.div>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-beagle pb-12"
    >
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate('/topics')}
          className="group inline-flex items-center gap-2 text-beagle-text-muted transition-colors hover:text-beagle-primary"
        >
          <ArrowLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Topics
        </button>

        <div className="flex items-center gap-4 text-sm font-medium">
          <AnimatePresence mode="wait">
            {saving ? (
              <motion.span
                key="saving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-beagle-primary"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-beagle-primary" />
                Saving…
              </motion.span>
            ) : lastSaved ? (
              <motion.span
                key="saved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-green-400/70"
              >
                Saved ·{' '}
                {lastSaved.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <DraftMetadata topic={topic} onUpdate={handleUpdate} />

      <DraftEditor topic={topic} onUpdate={handleUpdate} initialTab={initialTab} />

      <motion.div
        ref={publishRef}
        id="publish"
        className="mt-8 flex scroll-mt-24 flex-col gap-6 border-t border-beagle-border pt-8 lg:flex-row lg:items-start lg:justify-between"
      >
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-beagle-text-muted">
            Publishing
          </p>
          <p className="max-w-sm text-xs text-beagle-text-dimmed">
            Review both blog and LinkedIn drafts before publishing. Once published,
            your post will be live on SynthPanel. Only admins can publish (BP-407).
          </p>
        </div>
        <PublishControls topic={topic} onPublishSuccess={fetchTopic} />
      </motion.div>

      <SchedulePublish topic={topic} onSaved={fetchTopic} />
    </motion.section>
  )
}
