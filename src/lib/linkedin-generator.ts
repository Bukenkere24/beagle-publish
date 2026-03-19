import { supabase } from './supabase'

export async function generateLinkedInDraft(blogContent: string, title: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('generate-linkedin', {
    body: { blogContent, title }
  })
  
  if (error) {
    console.error('LinkedIn generation error:', error)
    throw new Error(error.message || 'Failed to generate LinkedIn draft')
  }
  
  return data.linkedinDraft
}
