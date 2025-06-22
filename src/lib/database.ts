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
        created_by,
        photos (count)
      )
    `)
    .eq('user_id', userId)
  return { data, error }
}

// Get vault photo count
export const getVaultPhotoCount = async (vaultId: string) => {
  const { count, error } = await supabase
    .from('photos')
    .select('*', { count: 'exact', head: true })
    .eq('vault_id', vaultId)
  return { count, error }
}

// Get all vault photo counts for a user
export const getVaultPhotoCounts = async (vaultIds: string[]) => {
  const { data, error } = await supabase
    .from('photos')
    .select('vault_id')
    .in('vault_id', vaultIds)
  
  if (error) return { data: null, error }
  
  // Count photos per vault
  const counts = vaultIds.reduce((acc: Record<string, number>, vaultId) => {
    acc[vaultId] = data?.filter(photo => photo.vault_id === vaultId).length || 0
    return acc
  }, {})
  
  return { data: counts, error: null }
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