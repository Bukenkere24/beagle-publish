export type TopicStatus = 'queued' | 'drafting' | 'review' | 'published' | 'rejected' | 'archived'

export interface TopicRow {
  id: string
  topic: string
  relevance_score: number | null
  keywords: string[] | null
  source: string
  status: TopicStatus
  draft_content: string | null
  draft_title: string | null
  slug: string | null
  meta_description: string | null
  published_at: string | null
  created_at: string
  linkedin_draft: string | null
  linkedin_post_id: string | null
  linkedin_published_at: string | null
  scheduled_publish_at: string | null
  destination: string[] | null
  created_by: string | null
  approved_by: string | null
}
