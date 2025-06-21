import { supabase } from './supabase'

export interface Profile {
  id: string
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
  bio: string | null
  gender: string | null
  notifications_enabled: boolean
  email_updates_enabled: boolean
  two_factor_enabled: boolean
  created_at: string
  updated_at: string
}

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

export const createProfile = async (userId: string, profileData: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, ...profileData }])
    .select()
    .single()

  return { data, error }
}