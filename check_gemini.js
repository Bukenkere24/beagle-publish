
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testGemini() {
  console.log('Testing Gemini API via Supabase Edge Function (Direct Fetch)...')
  
  try {
    const url = `${supabaseUrl}/functions/v1/generate-linkedin`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify({ 
        blogContent: 'This is a test blog post about Beagle AI and its awesome automation features.',
        title: 'Beagle AI Test',
        tone: 'professional'
      })
    })

    const body = await response.text()
    console.log('Status code:', response.status)
    console.log('Response body:', body)

    if (response.ok) {
      const data = JSON.parse(body)
      console.log('Full data response:', JSON.stringify(data, null, 2))
      if (data.linkedinDraft) {
        console.log('\x1b[32mRESULT: Gemini API is WORKING!\x1b[0m')
      } else {
        console.log('\x1b[33mRESULT: Empty response. Check Gemini credit/quota or Safety settings.\x1b[0m')
      }
    } else {
      if (body.includes('GEMINI_API_KEY')) {
        console.log('\x1b[31mRESULT: Gemini API Key is missing in Supabase secrets.\x1b[0m')
      } else if (response.status === 404) {
        console.log('\x1b[31mRESULT: Edge Function NOT FOUND. Is it deployed?\x1b[0m')
      } else {
        console.log('\x1b[31mRESULT: Gemini API check failed with status ' + response.status + '\x1b[0m')
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

testGemini()
