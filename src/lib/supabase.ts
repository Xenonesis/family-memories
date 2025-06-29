import { createClient } from '@supabase/supabase-js'

// Enhanced configuration with retry logic and better error handling
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

// Create Supabase client with enhanced options for better connection handling
export const supabase = createClient(config.url, config.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'family-memories-app'
    }
  },
  // Add retry configuration for better network resilience
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Enhanced connection test with retry logic
export const testSupabaseConnection = async (retries = 3): Promise<boolean> => {
  // Skip connection test during build time
  if (typeof window === 'undefined') {
    return true
  }

  // Skip if using placeholder values
  if (config.url === 'https://placeholder.supabase.co') {
    console.warn('Using placeholder Supabase configuration - skipping connection test')
    return false
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Testing Supabase connection (attempt ${attempt}/${retries})...`)
      
      // Simple query to test connection
      const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is OK for connection test
        throw error
      }
      
      console.log('✅ Supabase connection successful')
      return true
    } catch (error: any) {
      console.warn(`❌ Supabase connection attempt ${attempt} failed:`, error.message)
      
      // If this is the last attempt, log the full error
      if (attempt === retries) {
        console.error('🚨 All Supabase connection attempts failed. Please check:')
        console.error('1. Internet connectivity')
        console.error('2. Supabase service status: https://status.supabase.com')
        console.error('3. Environment variables are correct')
        console.error('4. Supabase project is active and accessible')
        return false
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt - 1) * 1000 // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  return false
}

// Wrapper function for Supabase operations with automatic retry
export const withRetry = async <T>(
  operation: () => Promise<T>,
  retries = 2,
  operationName = 'Supabase operation'
): Promise<T> => {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      // Check if it's a network-related error
      const isNetworkError = 
        error.message?.includes('fetch failed') ||
        error.message?.includes('SocketError') ||
        error.message?.includes('other side closed') ||
        error.code === 'NETWORK_ERROR' ||
        error.name === 'TypeError'

      if (isNetworkError && attempt <= retries) {
        console.warn(`${operationName} failed (attempt ${attempt}), retrying...`, error.message)
        
        // Wait before retrying with exponential backoff
        const delay = Math.pow(2, attempt - 1) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      // If it's not a network error or we've exhausted retries, throw the error
      throw error
    }
  }
  
  throw new Error(`${operationName} failed after ${retries + 1} attempts`)
}

// Initialize connection test on client side
if (typeof window !== 'undefined') {
  // Test connection after a short delay to allow the app to initialize
  setTimeout(() => {
    testSupabaseConnection().catch(error => {
      console.error('Initial Supabase connection test failed:', error)
    })
  }, 1000)
}