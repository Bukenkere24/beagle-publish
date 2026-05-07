import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { getCorsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const { blogContent, title, tone } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    const prompt = `You are a LinkedIn content writer for Beagle AI Solutions. 
Convert this blog post into a LinkedIn post. 
Write in a ${tone || 'professional'} tone.
Title: ${title}
Content: ${blogContent}

Requirements:
- Keep it 300-500 words.
- Start with a compelling hook.
- Include 3-5 relevant hashtags at the end.
- Use line breaks for readability.
- Do NOT use markdown formatting (like **bold** or italics) as LinkedIn doesn't render it.
- Focus on the main takeaways and value for the audience.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    )

    const data = await response.json()
    const linkedinDraft = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return new Response(
      JSON.stringify({ linkedinDraft }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
