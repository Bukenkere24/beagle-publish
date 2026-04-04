import { supabase } from './supabase'

export async function generateLinkedInDraft(blogContent: string, title: string, tone?: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('generate-linkedin', {
    body: { blogContent, title, tone }
  })
  
  if (error) {
    console.error('LinkedIn generation error:', error)
    throw new Error(error.message || 'Failed to generate LinkedIn draft')
  }
  
  return data.linkedinDraft
}
