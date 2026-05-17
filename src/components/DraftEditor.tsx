import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, FileText, Linkedin, Sparkles, Loader2 } from 'lucide-react'
import type { TopicRow } from '../types/topic'
import { generateLinkedInDraft } from '../lib/linkedin-generator'

interface DraftEditorProps {
  topic: TopicRow
  onUpdate: (updates: Partial<TopicRow>) => void
  initialTab?: 'blog' | 'linkedin'
}

type Tab = 'blog' | 'linkedin'

export default function DraftEditor({ topic, onUpdate, initialTab = 'blog' }: DraftEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)
  const [blogContent, setBlogContent] = useState(topic.draft_content || '')
  const [linkedinDraft, setLinkedinDraft] = useState(topic.linkedin_draft || '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setBlogContent(topic.draft_content || '')
    setLinkedinDraft(topic.linkedin_draft || '')
  }, [topic.id])

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab, topic.id])

  const handleBlogChange = (content: string) => {
    setBlogContent(content)
    debouncedSave({ draft_content: content })
  }

  const handleLinkedInChange = (content: string) => {
    setLinkedinDraft(content)
    debouncedSave({ linkedin_draft: content })
  }

  const debouncedSave = (updates: Partial<TopicRow>) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      onUpdate(updates)
    }, 1000)
  }

  const handleGenerateLinkedIn = async () => {
    if (!blogContent) return
    setIsGenerating(true)
    setGenerateError(false)
    try {
      const generated = await generateLinkedInDraft(blogContent, topic.draft_title || topic.topic)
      setLinkedinDraft(generated)
      onUpdate({ linkedin_draft: generated })
      setActiveTab('linkedin')
    } catch {
      setGenerateError(true)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-beagle-surface border border-beagle-border rounded-beagle overflow-hidden">
      {/* Tabs */}
      <div className="flex flex-wrap items-center border-b border-beagle-border bg-white/[0.02] px-2 sm:px-4">
        <button
          onClick={() => setActiveTab('blog')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
            activeTab === 'blog' ? 'text-beagle-primary' : 'text-beagle-text-muted hover:text-beagle-text-body'
          }`}
        >
          <FileText size={16} />
          Blog Draft
          {activeTab === 'blog' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-beagle-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('linkedin')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
            activeTab === 'linkedin' ? 'text-beagle-primary' : 'text-beagle-text-muted hover:text-beagle-text-body'
          }`}
        >
          <Linkedin size={16} />
          LinkedIn Post
          {activeTab === 'linkedin' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-beagle-primary" />
          )}
        </button>

        <div className="ml-auto">
          {activeTab === 'linkedin' && !linkedinDraft && (
            <button
              onClick={handleGenerateLinkedIn}
              disabled={isGenerating || !blogContent}
              className="flex items-center gap-2 bg-beagle-primary/10 text-beagle-primary hover:bg-beagle-primary/20 disabled:opacity-50 px-4 py-2 rounded-beagle-btn text-xs font-semibold uppercase tracking-wider transition-all"
            >
              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Generate Draft
            </button>
          )}
        </div>
      </div>

      {generateError && (
        <div
          role="alert"
          className="mx-4 mt-4 flex items-center gap-3 rounded-beagle border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <AlertCircle size={18} className="shrink-0" strokeWidth={1.5} />
          <span className="flex-1">
            LinkedIn generation failed. Check your connection and try again.
          </span>
          <button
            type="button"
            onClick={() => setGenerateError(false)}
            className="shrink-0 text-xs uppercase tracking-wider text-red-200 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div className="bg-black/20 p-3 sm:p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'blog' ? (
            <motion.div
              key="blog"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="grid h-[min(480px,65vh)] grid-cols-1 gap-4 lg:h-[600px] lg:grid-cols-2"
            >
              <div className="flex flex-col h-full bg-beagle-bg/50 border border-white/[0.05] rounded-beagle overflow-hidden">
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-beagle-text-faint">Markdown Editor</span>
                  <span className="text-[10px] text-beagle-text-faint">{blogContent.split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  value={blogContent}
                  onChange={(e) => handleBlogChange(e.target.value)}
                  placeholder="Paste or write your blog content here..."
                  className="flex-1 w-full bg-transparent p-6 text-beagle-text-body font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-beagle-text-faint/30"
                />
              </div>

              <div className="flex flex-col h-full bg-beagle-bg/30 border border-white/[0.05] rounded-beagle overflow-hidden">
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.05]">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-beagle-text-faint">Live Preview</span>
                </div>
                <div className="flex-1 overflow-auto p-8 prose prose-invert prose-headings:font-heading prose-p:text-beagle-text-body max-w-none">
                  <ReactMarkdown>{blogContent}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="linkedin"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="grid h-[min(480px,65vh)] grid-cols-1 gap-4 lg:h-[600px] lg:grid-cols-2"
            >
              <div className="flex flex-col h-full bg-beagle-bg/50 border border-white/[0.05] rounded-beagle overflow-hidden">
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-beagle-text-faint">LinkedIn Post Editor</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-bold ${linkedinDraft.length > 3000 ? 'text-red-400' : 'text-beagle-text-faint'}`}>
                      {linkedinDraft.length}/3000 chars
                    </span>
                    <button
                      onClick={handleGenerateLinkedIn}
                      disabled={isGenerating || !blogContent}
                      className="text-[10px] uppercase tracking-widest font-bold text-beagle-primary hover:text-beagle-primary-hover disabled:opacity-50"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
                <textarea
                  value={linkedinDraft}
                  onChange={(e) => handleLinkedInChange(e.target.value)}
                  placeholder="Post content optimized for LinkedIn..."
                  className="flex-1 w-full bg-transparent p-6 text-beagle-text-body font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder:text-beagle-text-faint/30"
                />
              </div>

              <div className="flex flex-col h-full bg-beagle-bg/30 border border-white/[0.05] rounded-beagle overflow-hidden">
                <div className="px-4 py-2 bg-white/[0.02] border-b border-white/[0.05]">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-beagle-text-faint">LinkedIn Preview</span>
                </div>
                <div className="flex-1 overflow-auto p-8 prose prose-invert max-w-none prose-p:text-beagle-text-body prose-p:my-2">
                  <p className="font-bold text-beagle-text-heading mb-4">Post Preview (Simulated)</p>
                  <div className="whitespace-pre-wrap font-sans text-sm text-beagle-text-body leading-relaxed">
                    {linkedinDraft || "Click 'Generate Draft' to create a LinkedIn post from your blog content."}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

