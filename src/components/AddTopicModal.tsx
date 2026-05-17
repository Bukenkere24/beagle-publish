import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { supabase } from '../lib/supabase'

type AddTopicModalProps = {
  isOpen: boolean
  onClose: () => void
  onAdded: () => void
}

const SOURCES = ['manual', 'hn', 'reddit'] as const

export default function AddTopicModal({ isOpen, onClose, onAdded }: AddTopicModalProps) {
  const [topic, setTopic] = useState('')
  const [source, setSource] = useState<'manual' | 'hn' | 'reddit'>('manual')
  const [keywordsInput, setKeywordsInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const trimmedTopic = topic.trim()
    if (!trimmedTopic) {
      setError('Topic is required')
      return
    }
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const keywordsArray = keywordsInput
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
      const { error: insertError } = await supabase.from('blog_topic_queue').insert({
        topic: trimmedTopic,
        source,
        status: 'queued',
        keywords: keywordsArray.length ? keywordsArray : null,
        created_by: user?.email ?? null,
      })
      if (insertError) throw insertError
      setTopic('')
      setKeywordsInput('')
      setSource('manual')
      onAdded()
      onClose()
    } catch {
      setError('Couldn’t add this topic. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      setError(null)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-beagle border border-beagle-border bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-beagle-text-heading font-heading font-semibold text-xl">
                Add Topic
              </h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="p-2 text-beagle-text-muted hover:text-beagle-text-body rounded-beagle hover:bg-beagle-border transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <X size={20} strokeWidth={1} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-beagle-text-secondary text-sm font-medium mb-2">
                  Topic
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What should we write about?"
                  rows={3}
                  className="w-full bg-beagle-surface border border-beagle-border rounded-beagle p-4 text-beagle-white placeholder-beagle-text-dimmed focus:border-beagle-primary focus:outline-none resize-none"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-beagle-text-secondary text-sm font-medium mb-2">
                  Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as 'manual' | 'hn' | 'reddit')}
                  className="w-full bg-beagle-surface border border-beagle-border rounded-beagle px-4 py-3 text-beagle-white focus:border-beagle-primary focus:outline-none"
                  disabled={submitting}
                >
                  {SOURCES.map((s) => (
                    <option key={s} value={s} className="bg-beagle-surface">
                      {s === 'manual' ? 'Manual' : s === 'hn' ? 'Hacker News' : 'Reddit'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-beagle-text-secondary text-sm font-medium mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="ai, product, startup"
                  className="w-full bg-beagle-surface border border-beagle-border rounded-beagle px-4 py-3 text-beagle-white placeholder-beagle-text-dimmed focus:border-beagle-primary focus:outline-none"
                  disabled={submitting}
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-beagle-primary text-white rounded-beagle-btn px-6 py-4 uppercase tracking-wider font-medium hover:bg-beagle-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Adding…' : 'Add Topic'}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  className="px-6 py-4 rounded-beagle-btn border border-beagle-border text-beagle-text-body hover:bg-beagle-border transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
