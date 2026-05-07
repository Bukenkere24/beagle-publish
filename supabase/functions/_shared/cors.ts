/** Origins allowed to call edge functions from the browser. Override with ALLOWED_ORIGINS (comma-separated). */
const DEFAULT_ORIGINS = [
  'https://beagle-publish-gamma.vercel.app',
  'http://localhost:5173',
]

function allowedOrigins(): string[] {
  const raw = Deno.env.get('ALLOWED_ORIGINS')
  if (!raw?.trim()) return DEFAULT_ORIGINS
  return raw.split(',').map((o) => o.trim()).filter(Boolean)
}

/** CORS headers for this request. Omits Access-Control-Allow-Origin when Origin is missing or not allowlisted. */
export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin')
  const allowed = allowedOrigins()
  const base: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
  }
  if (origin && allowed.includes(origin)) {
    return {
      ...base,
      'Access-Control-Allow-Origin': origin,
      Vary: 'Origin',
    }
  }
  return base
}
