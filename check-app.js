
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

async function runHealthCheck() {
  console.log('🚀 Beagle Publish Deep Health Check...\n')
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // 1. Check DB Topics
  console.log('🗄️  Analyzing topics in blog_topic_queue...')
  const { data: topics, error: dbError } = await supabase
    .from('blog_topic_queue')
    .select('status, topic, linkedin_published_at')

  if (dbError) {
    console.error(`❌ DB Error: ${dbError.message}`)
  } else {
    console.log(`✅ Database connected. Found ${topics.length} topics.`)
    const queued = topics.filter(t => t.status === 'queued').length
    const published = topics.filter(t => t.status === 'published').length
    console.log(`   - Queued: ${queued}`)
    console.log(`   - Published: ${published}`)
    
    if (queued > 0) {
        console.log(`   💡 You have ${queued} topics waiting. If they aren't processing, Gemini might be limited.`)
    }
  }

  // 2. Check Gemini via Edge Function
  console.log('\n🤖 Testing Gemini API via Edge Function...')
  try {
    const url = `${supabaseUrl}/functions/v1/generate-linkedin`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({ blogContent: 'test', title: 'test', tone: 'professional' })
    })

    if (response.status === 401) {
        console.error('❌ Gemini check failed: 401 Unauthorized.')
        console.log('   💡 YOUR SUPABASE KEY IS INVALID FOR EDGE FUNCTIONS.')
        console.log('   💡 This prevents me from checking the Gemini quota via the function.')
    } else if (response.status === 429) {
        console.error('❌ Gemini check failed: 429 Too Many Requests.')
        console.log('   🚨 GEMINI API LIMITS HAVE BEEN FINISHED!')
    } else {
        const result = await response.json()
        console.log(`✅ Gemini Responded: ${response.status} ${response.statusText}`)
        console.log('   Response Body:', JSON.stringify(result).substring(0, 100))
    }
  } catch (err) {
    console.error(`❌ Unexpected error: ${err.message}`)
  }
}

runHealthCheck()
