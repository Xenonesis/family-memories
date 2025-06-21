# Deploy with environment variables using Netlify CLI
# First, install Netlify CLI if you haven't already:
# npm install -g netlify-cli

# Login to Netlify
netlify login

# Set environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://mwzalxctdbpnourkyjcp.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13emFseGN0ZGJwbm91cmt5amNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDgxMjksImV4cCI6MjA2NjAyNDEyOX0.2MqMydh03ErT7tt9keSSb-XgphJOzNG3ztxsmvH87EA"

# Deploy
netlify deploy --prod
