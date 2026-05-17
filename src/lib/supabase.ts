import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function createSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    const missing = [
      !supabaseUrl && 'VITE_SUPABASE_URL',
      !supabaseAnonKey && 'VITE_SUPABASE_ANON_KEY',
    ].filter(Boolean)

    console.warn(
      `[Beagle Publish] Missing env vars: ${missing.join(', ')}.\n` +
      `Copy .env.example to .env and fill in your Supabase project values.\n` +
      `The app will not function until these are set.`
    )

    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-anon-key'
    ) as SupabaseClient
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()
