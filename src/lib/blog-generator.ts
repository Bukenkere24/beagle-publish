import { supabase } from './supabase'

export interface BlogDraftResponse {
  title: string
  content: string
  slug: string
  researchBrief: string
  agents: string[]
}

export async function generateBlogDraft(params: {
  topic: string
  tone?: string
  publicationName?: string
  topicsOfInterest?: string[]
  existingDraft?: string
}): Promise<BlogDraftResponse> {
  const { data, error } = await supabase.functions.invoke('generate-blog-draft', {
    body: params
  })
  
  if (error) {
    console.error('Blog generation error:', error)
    throw new Error(error.message || 'Failed to generate blog draft')
  }
  
  return data as BlogDraftResponse
}
