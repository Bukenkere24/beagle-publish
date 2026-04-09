import { useState, useEffect } from 'react'
import type { TopicRow } from '../types/topic'

interface DraftMetadataProps {
  topic: TopicRow
  onUpdate: (updates: Partial<TopicRow>) => void
}

export default function DraftMetadata({ topic, onUpdate }: DraftMetadataProps) {
  const [title, setTitle] = useState(topic.draft_title || '')
  const [slug, setSlug] = useState(topic.slug || '')
  const [description, setDescription] = useState(topic.meta_description || '')

  /* Sync local fields when the loaded topic row changes (e.g. navigation). */
  /* eslint-disable react-hooks/set-state-in-effect -- reset controlled inputs when topic changes */
  useEffect(() => {
    setTitle(topic.draft_title || '')
    setSlug(topic.slug || '')
    setDescription(topic.meta_description || '')
  }, [topic.id, topic.draft_title, topic.slug, topic.meta_description])
  /* eslint-enable react-hooks/set-state-in-effect */

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    const newSlug = generateSlug(newTitle)
    setSlug(newSlug)
    onUpdate({ draft_title: newTitle, slug: newSlug })
  }

  return (
    <div className="mb-8 space-y-6">
      <div>
        <label className="block text-beagle-text-muted text-xs uppercase tracking-widest font-semibold mb-2">
          Post Title
        </label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter post title..."
          className="w-full bg-transparent text-beagle-text-heading text-4xl font-heading font-semibold border-none focus:ring-0 p-0 placeholder:text-beagle-text-dimmed/30"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-beagle-text-muted text-xs uppercase tracking-widest font-semibold mb-2">
            URL Slug
          </label>
          <div className="flex items-center gap-2 text-beagle-text-dimmed bg-beagle-surface border border-beagle-border rounded-beagle px-3 py-2">
            <span className="text-beagle-text-faint select-none">synthpanel.com/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value)
                onUpdate({ slug: e.target.value })
              }}
              className="bg-transparent border-none focus:ring-0 p-0 w-full text-sm font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-beagle-text-muted text-xs uppercase tracking-widest font-semibold mb-2">
            Meta Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              onUpdate({ meta_description: e.target.value })
            }}
            placeholder="Brief summary for SEO..."
            className="w-full bg-beagle-surface border border-beagle-border rounded-beagle px-3 py-2 text-sm text-beagle-text-body focus:border-beagle-primary/50 focus:ring-1 focus:ring-beagle-primary/20 transition-all outline-none"
          />
        </div>
      </div>
    </div>
  )
}
