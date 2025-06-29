import { supabase, withRetry } from './supabase'
import type { Database } from './types'
import type { UserVaultResponse } from './types'

// Enhanced database operations with automatic retry logic
export const db = {
  // Profiles operations
  profiles: {
    async get(userId: string) {
      return withRetry(
        () => supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single(),
        2,
        'Get profile'
      )
    },

    async update(userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) {
      return withRetry(
        () => supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId)
          .select()
          .single(),
        2,
        'Update profile'
      )
    },

    async create(profile: Database['public']['Tables']['profiles']['Insert']) {
      return withRetry(
        () => supabase
          .from('profiles')
          .insert(profile)
          .select()
          .single(),
        2,
        'Create profile'
      )
    }
  },

  // Vaults operations
  vaults: {
    async get(vaultId: string) {
      return withRetry(
        () => supabase
          .from('vaults')
          .select('*')
          .eq('id', vaultId)
          .single(),
        2,
        'Get vault'
      )
    },

    async create(vault: Database['public']['Tables']['vaults']['Insert']) {
      return withRetry(
        () => supabase
          .from('vaults')
          .insert(vault)
          .select()
          .single(),
        2,
        'Create vault'
      )
    },

    async update(vaultId: string, updates: Partial<Database['public']['Tables']['vaults']['Update']>) {
      return withRetry(
        () => supabase
          .from('vaults')
          .update(updates)
          .eq('id', vaultId)
          .select()
          .single(),
        2,
        'Update vault'
      )
    },

    async delete(vaultId: string) {
      return withRetry(
        () => supabase
          .from('vaults')
          .delete()
          .eq('id', vaultId),
        2,
        'Delete vault'
      )
    }
  },

  // Photos operations
  photos: {
    async list(vaultId: string) {
      return withRetry(
        () => supabase
          .from('photos')
          .select('*')
          .eq('vault_id', vaultId)
          .order('created_at', { ascending: false }),
        2,
        'List photos'
      )
    },

    async get(photoId: string) {
      return withRetry(
        () => supabase
          .from('photos')
          .select('*')
          .eq('id', photoId)
          .single(),
        2,
        'Get photo'
      )
    },

    async create(photo: Database['public']['Tables']['photos']['Insert']) {
      return withRetry(
        () => supabase
          .from('photos')
          .insert(photo)
          .select()
          .single(),
        2,
        'Create photo'
      )
    },

    async update(photoId: string, updates: Partial<Database['public']['Tables']['photos']['Update']>) {
      return withRetry(
        () => supabase
          .from('photos')
          .update(updates)
          .eq('id', photoId)
          .select()
          .single(),
        2,
        'Update photo'
      )
    },

    async delete(photoId: string) {
      return withRetry(
        () => supabase
          .from('photos')
          .delete()
          .eq('id', photoId),
        2,
        'Delete photo'
      )
    }
  }
}

// Get user vaults through vault_members table
export const getUserVaults = async (userId: string) => {
  return withRetry(
    () => supabase
      .from('vault_members')
      .select('role, vaults(*, photos(count))')
      .eq('user_id', userId)
      .order('created_at', { foreignTable: 'vaults', ascending: false }),
    2,
    'Get user vaults'
  )
}

// Upload photo function
export const uploadPhoto = async (
  vaultId: string,
  userId: string,
  title: string,
  description: string,
  fileUrl: string
) => {
  return withRetry(
    () => supabase
      .from('photos')
      .insert({
        vault_id: vaultId,
        uploaded_by: userId,
        title,
        description,
        file_url: fileUrl
      })
      .select()
      .single(),
    2,
    'Upload photo'
  )
}

// Health check function
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const { error } = await withRetry(
      () => supabase.from('profiles').select('count', { count: 'exact', head: true }),
      1,
      'Database health check'
    )
    
    return !error || error.code === 'PGRST116' // PGRST116 means table doesn't exist, which is OK for health check
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}