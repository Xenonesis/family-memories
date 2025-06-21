import { supabase } from './supabase'

export const uploadFile = async (file: File, userId: string, vaultId: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${vaultId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('photos')
    .upload(fileName, file)
  
  if (error) {
    return { data: null, error }
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName)
  
  return { data: { ...data, publicUrl }, error: null }
}