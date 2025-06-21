import { createClient } from '@supabase/supabase-js'

// Client-side environment check
const getSupabaseConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (typeof window === 'undefined') {
    // Server-side rendering - check if variables exist but don't throw
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not set during build time')
      // Return dummy values for build time
      return {
        url: 'https://placeholder.supabase.co',
        anonKey: 'placeholder-key'
      }
    }
  } else {
    // Client-side - throw error if variables are missing
    if (!supabaseUrl) {
      throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
    }
    
    if (!supabaseAnonKey) {
      throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
    }
  }

  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey
  }
}

const config = getSupabaseConfig()
export const supabase = createClient(config.url, config.anonKey)