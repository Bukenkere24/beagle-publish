import { useState } from 'react'
import { FileText, Linkedin, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { publishAdapters, type Draft, type PublishAdapter } from '../lib/publishers'
import type { TopicRow } from '../types/topic'

const ICON_MAP = { FileText, Linkedin } as const

function getWordCount(text: string | null): number {
  if (!text || !text.trim()) return 0
  return text.trim().split(/\s+/).length
}

type PublishControlsProps = {
  topic: TopicRow
  onPublishSuccess: () => void
}

export default function PublishControls({ topic, onPublishSuccess }: PublishControlsProps) {
  const [confirmAdapter, setConfirmAdapter] = useState<PublishAdapter | null>(null)
  const [rejectConfirm, setRejectConfirm] = useState(false)
  const [publishing, setPublishing] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const draft: Draft = {
    id: topic.id,
    status: topic.status,
    draft_content: topic.draft_content,
    draft_title: topic.draft_title,
    slug: topic.slug,
    meta_description: topic.meta_description,
    linkedin_draft: topic.linkedin_draft,
    published_at: topic.published_at,
    linkedin_published_at: topic.linkedin_published_at,
  }

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 4000)
  }

  const handlePublish = async (adapter: PublishAdapter) => {
    setPublishing(adapter.name)
    try {
      const result = await adapter.publish(draft)
      setConfirmAdapter(null)
      if (result.success) {
        if (adapter.name === 'linkedin') {
          showToast('Draft copied! Paste it in LinkedIn → click Post')
        }
        onPublishSuccess()
      } else {
        showToast(result.error ?? 'Publish failed')
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Publish failed')
    } finally {
      setPublishing(null)
    }
  }

  const handleReject = async () => {
    setPublishing('reject')
    try {
      const { error } = await supabase
        .from('blog_topic_queue')
        .update({ status: 'rejected' })
        .eq('id', topic.id)
      if (error) throw error
      setRejectConfirm(false)
      onPublishSuccess()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Reject failed')
    } finally {
      setPublishing(null)
    }
  }

  const isBlogPublished = topic.status === 'published'
  const blogUrl = topic.slug ? `https://synthpanel.com/blog/${topic.slug}` : null

  return (
    <div className="flex flex-wrap gap-4 rounded-beagle border border-beagle-border bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6">
      <h3 className="text-beagle-primary text-xl font-semibold w-full">Publish</h3>

      {isBlogPublished && blogUrl && (
        <div className="w-full rounded-beagle border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-400">
          <span className="font-medium">Published ✓</span>
          <a
            href={blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 underline hover:no-underline"
          >
            {blogUrl}
          </a>
        </div>
      )}

      {publishAdapters.map((adapter) => {
        const canPublish = adapter.canPublish(draft)
        const Icon = ICON_MAP[adapter.icon as keyof typeof ICON_MAP] ?? FileText
        const isPublished =
          (adapter.name === 'blog' && topic.status === 'published') ||
          (adapter.name === 'linkedin' && !!topic.linkedin_published_at)

        return (
          <div key={adapter.name} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!canPublish || isPublished}
              onClick={() => canPublish && !isPublished && setConfirmAdapter(adapter)}
              className="inline-flex items-center gap-2 bg-beagle-primary text-white rounded-beagle-btn px-6 py-4 uppercase tracking-wider font-medium hover:bg-beagle-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {publishing === adapter.name ? (
                <Loader2 size={18} className="animate-spin" strokeWidth={1} />
              ) : (
                <Icon size={18} strokeWidth={1} />
              )}
              {isPublished ? 'Published ✓' : adapter.label}
            </button>
          </div>
        )
      })}

      {topic.status === 'review' && (
        <button
          type="button"
          disabled={!!publishing}
          onClick={() => setRejectConfirm(true)}
          className="rounded-beagle-btn px-6 py-4 uppercase tracking-wider font-medium border border-beagle-border text-beagle-text-muted hover:bg-beagle-primary-ghost hover:text-beagle-primary hover:border-beagle-primary transition-colors disabled:opacity-50"
        >
          {publishing === 'reject' ? <Loader2 size={18} className="animate-spin inline" strokeWidth={1} /> : 'Reject'}
        </button>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-beagle border border-beagle-border bg-beagle-surface px-4 py-3 text-beagle-text-body shadow-lg backdrop-blur-sm">
          {toast}
        </div>
      )}

      {/* Confirmation modal for publish */}
      {confirmAdapter && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
          onClick={() => !publishing && setConfirmAdapter(null)}
        >
          <div
            className="rounded-beagle border border-beagle-border bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-beagle-text-heading font-semibold text-lg mb-4">
              {confirmAdapter.label}
            </h4>
            <div className="space-y-2 text-sm text-beagle-text-body mb-6">
              <p><span className="text-beagle-text-muted">Title:</span> {topic.draft_title || 'Untitled'}</p>
              <p><span className="text-beagle-text-muted">Word count:</span> {getWordCount(confirmAdapter.name === 'blog' ? topic.draft_content : topic.linkedin_draft)}</p>
              {confirmAdapter.name === 'blog' && topic.slug && (
                <p><span className="text-beagle-text-muted">URL:</span> https://synthpanel.com/blog/{topic.slug}</p>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => !publishing && setConfirmAdapter(null)}
                className="rounded-beagle-btn px-6 py-3 border border-beagle-border text-beagle-text-muted hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handlePublish(confirmAdapter)}
                disabled={!!publishing}
                className="rounded-beagle-btn px-6 py-3 bg-beagle-primary text-white font-medium hover:bg-beagle-primary-hover disabled:opacity-50 inline-flex items-center gap-2"
              >
                {publishing === confirmAdapter.name ? (
                  <>
                    <Loader2 size={16} className="animate-spin" strokeWidth={1} />
                    Publishing...
                  </>
                ) : (
                  confirmAdapter.name === 'blog' ? 'Publish Now' : 'Copy & Open LinkedIn'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject confirmation modal */}
      {rejectConfirm && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50"
          onClick={() => !publishing && setRejectConfirm(false)}
        >
          <div
            className="rounded-beagle border border-beagle-border bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-beagle-text-heading font-semibold text-lg mb-2">Reject this draft?</h4>
            <p className="text-beagle-text-muted text-sm mb-6">This will set the topic status to rejected. You can’t easily undo this.</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => !publishing && setRejectConfirm(false)}
                className="rounded-beagle-btn px-6 py-3 border border-beagle-border text-beagle-text-muted hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!!publishing}
                className="rounded-beagle-btn px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50"
              >
                {publishing === 'reject' ? <Loader2 size={16} className="animate-spin inline" strokeWidth={1} /> : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
