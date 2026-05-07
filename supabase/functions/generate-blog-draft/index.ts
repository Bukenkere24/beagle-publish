import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { getCorsHeaders } from '../_shared/cors.ts'

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

async function callGemini(systemPrompt: string, userPrompt: string, apiKey: string): Promise<string> {
  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    }),
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error: ${err}`)
  }
  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const { topic, tone, publicationName, topicsOfInterest, existingDraft } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    // ─── AGENT 1: RESEARCH ─────────────────────────────────
    const researchPrompt = `You are a content research analyst.
Analyze this blog topic and produce a structured research brief.
Include: main angle, 3-4 key points to cover, target audience, suggested title options (3), and a brief competitive landscape (what already exists on this topic).
${topicsOfInterest?.length ? `The publication focuses on: ${topicsOfInterest.join(', ')}.` : ''}
Be specific and actionable. Output as structured text with clear sections.`

    const researchBrief = await callGemini(researchPrompt, `Topic: ${topic}`, apiKey)

    // ─── AGENT 2: WRITER ───────────────────────────────────
    const writerPrompt = `You are a professional blog writer for ${publicationName || 'a tech publication'}.
Write in a ${tone || 'professional'} tone.
Use the research brief below to write an 800-1200 word blog post.
Structure: compelling opening hook, 3-4 sections with headers (use ## for sections), actionable conclusion.
Use Markdown formatting. Be specific — use real examples, numbers, and concrete advice.
Do NOT start with "In today's world" or similar clichés.
${existingDraft ? 'Improve upon the existing draft while keeping its core ideas.' : ''}

IMPORTANT: Return ONLY the blog post content. Start with a ## section header, not the title. The title should be on the FIRST LINE by itself (no # prefix).`

    const draftContent = await callGemini(
      writerPrompt,
      `Research Brief:\n${researchBrief}\n\nTopic: ${topic}${existingDraft ? `\n\nExisting draft:\n${existingDraft}` : ''}`,
      apiKey
    )

    // ─── AGENT 3: EDITOR ───────────────────────────────────
    const editorPrompt = `You are a senior content editor.
Review and polish this blog draft for:
1. Readability (short paragraphs, varied sentence length, active voice)
2. SEO (natural keyword usage, meta-description-worthy opening)
3. Tone consistency (${tone || 'professional'} throughout)
4. Structure (clear headers, logical flow, strong conclusion with CTA)

Return the COMPLETE polished draft (not just suggestions). Keep the same structure.
First line = title (no # prefix). Rest = blog content with ## section headers.`

    const polishedDraft = await callGemini(editorPrompt, draftContent, apiKey)

    // ─── PARSE OUTPUT ──────────────────────────────────────
    const lines = polishedDraft.split('\n')
    const title = lines[0].replace(/^#+\s*/, '').replace(/^\*+/, '').replace(/\*+$/, '').trim()
    const content = lines.slice(1).join('\n').trim()
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    return new Response(
      JSON.stringify({
        title,
        content,
        slug,
        researchBrief,
        agents: ['research', 'writer', 'editor'],
      }),
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
        status: 500 
      }
    )
  }
})
