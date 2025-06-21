import { supabase } from './supabase'

// Vault operations
export const createVault = async (name: string, description: string, color: string, userId: string) => {
  const { data, error } = await supabase
    .from('vaults')
    .insert([
      {
        name,
        description,
        color,
        created_by: userId,
      }
    ])
    .select()
  return { data, error }
}

export const getUserVaults = async (userId: string) => {
  const { data, error } = await supabase
    .from('vault_members')
    .select(`
      role,
      vaults (
        id,
        name,
        description,
        color,
        created_at,
        created_by
      )
    `)
    .eq('user_id', userId)
  return { data, error }
}

// Photo operations
export const uploadPhoto = async (vaultId: string, userId: string, title: string, description: string, fileUrl: string) => {
  const { data, error } = await supabase
    .from('photos')
    .insert([
      {
        vault_id: vaultId,
        uploaded_by: userId,
        title,
        description,
        file_url: fileUrl,
      }
    ])
    .select()
    
  return { data, error }
}

export const getVaultPhotos = async (vaultId: string) => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('vault_id', vaultId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// Vault member operations
export const addVaultMember = async (vaultId: string, userId: string, role: string = 'member') => {
  const { data, error } = await supabase
    .from('vault_members')
    .insert([
      {
        vault_id: vaultId,
        user_id: userId,
        role
      }
    ])
    .select()
  return { data, error }
}