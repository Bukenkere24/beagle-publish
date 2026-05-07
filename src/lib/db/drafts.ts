import { supabase } from '../supabase'
import type { TopicRow } from '../../types/topic'

export async function getDraft(id: string) {
  const { data, error } = await supabase
    .from('blog_topic_queue')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as TopicRow
}

export async function saveDraft(id: string, updates: Partial<TopicRow>) {
  const { error } = await supabase
    .from('blog_topic_queue')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export async function publishDraft(id: string, destination: string[]) {
  // This likely involves updating status and published_at
  const { data, error } = await supabase
    .from('blog_topic_queue')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      destination
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as TopicRow
}
