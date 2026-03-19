import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { TopicRow } from '../types/topic'
import DraftEditor from '../components/DraftEditor'
import DraftMetadata from '../components/DraftMetadata'
import PublishControls from '../components/PublishControls'

export default function DraftEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [topic, setTopic] = useState<TopicRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const fetchTopic = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('blog_topic_queue')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      setTopic(data as TopicRow)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load topic')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTopic()
  }, [fetchTopic])

  const handleUpdate = async (updates: Partial<TopicRow>) => {
    if (!id || !topic) return
    
    // Update local state first for responsiveness
    setTopic(prev => prev ? { ...prev, ...updates } : null)
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('blog_topic_queue')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      setLastSaved(new Date())
    } catch (err) {
      console.error('Save failed:', err)
      // Potentially revert state or show error toast
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-beagle-text-muted">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p>Loading draft...</p>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="max-w-beagle mx-auto text-center py-12">
        <p className="text-red-400 mb-6">{error || 'Topic not found'}</p>
        <button
          onClick={() => navigate('/topics')}
          className="inline-flex items-center gap-2 bg-beagle-surface border border-beagle-border rounded-beagle px-6 py-3 text-beagle-white hover:border-beagle-border-hover transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Topics
        </button>
      </div>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-beagle mx-auto pb-12"
    >
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/topics')}
          className="inline-flex items-center gap-2 text-beagle-text-muted hover:text-beagle-primary transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
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
                className="text-beagle-primary flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-beagle-primary animate-pulse" />
                Saving...
              </motion.span>
            ) : lastSaved ? (
              <motion.span
                key="saved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-green-400/70"
              >
                Saved ✓ {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <DraftMetadata 
        topic={topic} 
        onUpdate={handleUpdate} 
      />

      <DraftEditor 
        topic={topic} 
        onUpdate={handleUpdate} 
      />

      <div className="mt-8 border-t border-beagle-border pt-8 flex justify-between items-center">
        <div>
          <p className="text-beagle-text-muted text-sm uppercase tracking-widest font-semibold mb-2">Publishing</p>
          <p className="text-beagle-text-dimmed text-xs max-w-sm">Review both blog and LinkedIn drafts before publishing. Once published, your post will be live on SynthPanel.</p>
        </div>
        <PublishControls topic={topic} onPublishSuccess={fetchTopic} />
      </div>
    </motion.section>
  )
}

