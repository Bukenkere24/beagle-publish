/**
 * Draft shape required for publishing. Matches the fields from blog_topic_queue
 * that adapters need to decide canPublish and to perform publish.
 */
export interface Draft {
  id: string
  status: string
  draft_content: string | null
  draft_title: string | null
  slug: string | null
  meta_description: string | null
  linkedin_draft: string | null
  published_at: string | null
  linkedin_published_at: string | null
}

export interface PublishResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Publisher adapter: one implementation per destination (blog, LinkedIn, etc.).
 * UI renders publish buttons dynamically from registered adapters.
 */
export interface PublishAdapter {
  name: string
  label: string
  icon: string
  canPublish: (draft: Draft) => boolean
  publish: (draft: Draft) => Promise<PublishResult>
}
