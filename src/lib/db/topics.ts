import { supabase } from '../supabase'
import type { TopicRow } from '../../types/topic'

export async function getTopics(userId?: string, isAdmin: boolean = false) {
  let query = supabase
    .from('blog_topic_queue')
    .select('*')
    .order('created_at', { ascending: false })

  if (!isAdmin && userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
  if (error) throw error
  return (data as TopicRow[]) ?? []
}

export async function createTopic(topic: Partial<TopicRow>) {
  const { data, error } = await supabase
    .from('blog_topic_queue')
    .insert(topic)
    .select()
    .single()

  if (error) throw error
  return data as TopicRow
}

export async function updateTopic(id: string, updates: Partial<TopicRow>) {
  const { data, error } = await supabase
    .from('blog_topic_queue')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as TopicRow
}
