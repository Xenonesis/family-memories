# Upload Troubleshooting Guide

## 1. Correct URL
Always use: `http://192.168.180.1:3001/upload` (port 3001, not 3000)

## 2. Setup Checklist

### Database Setup
1. Run the complete SQL schema in Supabase:
```sql
-- Run the entire supabase-schema.sql file in your Supabase SQL editor
```

2. Verify tables exist:
- vaults
- vault_members  
- photos
- photo_likes

3. Verify storage bucket exists:
- Bucket name: 'photos'
- Public access: enabled

### Authentication
1. Create a user account first at `/auth`
2. Sign in before trying to upload
3. Create at least one vault at `/create-vault`

### Upload Process
1. Go to `/upload`
2. Check debug info shows:
   - User authenticated
   - At least 1 vault membership
3. Select a vault (blue highlighted)
4. Select files using "Browse Files" button
5. Fill in titles/descriptions
6. Click "Upload X Photos"

## 3. Common Issues

### "Upload 0 Photos" button
- This means no files are selected
- Try clicking "Browse Files" and selecting image files
- Check browser console for JavaScript errors

### No vaults showing
- Create a vault first at `/create-vault`
- Check if user is authenticated

### Upload fails
- Check browser console for errors
- Verify Supabase environment variables
- Check if storage bucket exists
- Verify RLS policies allow uploads

## 4. Debug Steps
1. Open browser console (F12)
2. Go to `/debug` page to run diagnostics
3. Check console logs for detailed error messages
4. Verify each step works: auth → vaults → file selection → upload

## 5. Console Warnings

### ✅ RESOLVED: "params is now a Promise" Warning

This Next.js migration warning has been fixed. Previously appeared when accessing route parameters.

**Fixed in**: `/src/app/vault/[id]/page.tsx` - Updated to use `React.use(params)`

### Other Console Messages

- Cross-origin request warnings are normal for development
- Image optimization warnings are suggestions, not errors
