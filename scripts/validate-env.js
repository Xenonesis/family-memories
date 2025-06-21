#!/usr/bin/env node

/**
 * Environment validation script for Family Memories app
 * Run with: node scripts/validate-env.js
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

console.log('🔍 Validating environment variables...\n')

let allValid = true
const missingVars = []

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar]
  
  if (!value) {
    console.log(`❌ ${envVar}: Missing`)
    missingVars.push(envVar)
    allValid = false
  } else {
    // Show partial value for security
    const maskedValue = value.substring(0, 10) + '...'
    console.log(`✅ ${envVar}: ${maskedValue}`)
  }
}

console.log('\n' + '='.repeat(50))

if (allValid) {
  console.log('🎉 All required environment variables are set!')
  process.exit(0)
} else {
  console.log('⚠️  Missing required environment variables:')
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`)
  })
  
  console.log('\n📝 To fix this:')
  console.log('1. Copy .env.example to .env.local')
  console.log('2. Fill in your Supabase credentials')
  console.log('3. For Netlify deployment, add these to Site settings → Environment variables')
  console.log('\n� Note: Build will continue with placeholder values for missing variables')
  
  // Don't exit with error code to allow builds to continue
  process.exit(0)
}
