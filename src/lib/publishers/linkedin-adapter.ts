import { supabase } from '../supabase'
import type { PublishAdapter, Draft, PublishResult } from './types'

/**
 * LinkedIn "Copy & Post" adapter (Implementation A).
 * Copies draft to clipboard, opens company page admin, updates DB.
 */
export const linkedinCopyAdapter: PublishAdapter = {
  name: 'linkedin',
  label: 'Post to LinkedIn',
  icon: 'Linkedin',
  canPublish: (draft) => !!draft.linkedin_draft,
  publish: async (draft): Promise<PublishResult> => {
    try {
      if (!draft.linkedin_draft) {
        return { success: false, error: 'No LinkedIn draft' }
      }
      await navigator.clipboard.writeText(draft.linkedin_draft)
      window.open('https://www.linkedin.com/company/beagle-ai-solutions/admin/', '_blank')
      await supabase
        .from('blog_topic_queue')
        .update({
          linkedin_published_at: new Date().toISOString(),
        })
        .eq('id', draft.id)
      return {
        success: true,
        url: 'https://www.linkedin.com/company/beagle-ai-solutions/',
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Post failed',
      }
    }
  },
}
