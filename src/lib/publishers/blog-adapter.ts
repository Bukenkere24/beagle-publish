import { supabase } from '../supabase'
import type { PublishAdapter, PublishResult } from './types'

export const blogAdapter: PublishAdapter = {
  name: 'blog',
  label: 'Publish to Blog',
  icon: 'FileText',
  canPublish: (draft) => draft.status === 'review' && !!draft.draft_content,
  publish: async (draft): Promise<PublishResult> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase
        .from('blog_topic_queue')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          approved_by: user?.email ?? null,
        })
        .eq('id', draft.id)

      if (error) return { success: false, error: error.message }
      const url = draft.slug
        ? `https://synthpanel-mupn.vercel.app/blog/${draft.slug}`
        : undefined
      return { success: true, url }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Publish failed',
      }
    }
  },
}
