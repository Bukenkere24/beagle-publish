
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkStatus() {
  const { data, error, count } = await supabase
    .from('blog_topic_queue')
    .select('id, topic, status, published_at, linkedin_published_at', { count: 'exact' })
  
  if (error) {
    console.error('Error fetching topics:', error)
    return
  }

  console.log(`Total topics: ${count}`)
  
  const publishedCount = data?.filter(t => t.status === 'published').length || 0
  const linkedinPublishedCount = data?.filter(t => t.linkedin_published_at).length || 0
  
  console.log(`Published to blog: ${publishedCount}`)
  console.log(`Published to LinkedIn: ${linkedinPublishedCount}`)
  
  const bothCount = data?.filter(t => t.status === 'published' && t.linkedin_published_at).length || 0
  console.log(`Published to both: ${bothCount}`)

  console.log('\nTopic list:')
  data?.forEach(t => {
    console.log(`- [${t.status}] ${t.topic.substring(0, 50)}... (LinkedIn: ${t.linkedin_published_at ? 'Yes' : 'No'})`)
  })
}

checkStatus()
