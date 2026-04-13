// Sanity check for types and context existence
import { UserPreferences, DEFAULT_PREFERENCES } from '../src/types/preferences'
import { BlogDraftResponse } from '../src/lib/blog-generator'

console.log('Types check started...')

const mockPrefs: UserPreferences = {
  ...DEFAULT_PREFERENCES,
  defaultTone: 'creative',
  publicationName: 'Test Pub'
}

console.log('Mock Preferences:', mockPrefs)

const mockResponse: BlogDraftResponse = {
  title: 'Test Title',
  content: 'Test content',
  slug: 'test-title',
  researchBrief: 'Brief...',
  agents: ['research', 'writer', 'editor']
}

console.log('Mock Response:', mockResponse)
console.log('Sanity check passed!')
