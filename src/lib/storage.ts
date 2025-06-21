import { supabase } from './supabase'

export const uploadFile = async (file: File, userId: string, vaultId: string) => {
  console.log('Storage: Starting file upload', { fileName: file.name, fileSize: file.size, userId, vaultId });
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${vaultId}/${Date.now()}.${fileExt}`
  
  console.log('Storage: Generated file path:', fileName);
  
  const { data, error } = await supabase.storage
    .from('photos')
    .upload(fileName, file)
  
  if (error) {
    console.error('Storage: Upload failed', error);
    return { data: null, error }
  }
  
  console.log('Storage: Upload successful', data);
  
  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName)
  
  console.log('Storage: Generated public URL:', publicUrl);
  
  return { data: { ...data, publicUrl }, error: null }
}