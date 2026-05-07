import { supabase } from '../supabase'
import type { Profile } from '../../types/profile'

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('bcc_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data as Profile | null
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('bcc_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data as Profile
}
