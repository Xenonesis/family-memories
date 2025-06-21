# 🚀 Deployment Troubleshooting Guide

## Common Netlify Deployment Issues

### ❌ Build Error: "supabaseUrl is required"

**Problem:** Environment variables are not set in Netlify, causing the build to fail during static generation.

**Error Message:**

```
Error occurred prerendering page "/dashboard". Read more: https://nextjs.org/docs/messages/prerender-error
Error: supabaseUrl is required.
```

**Solution:**

1. **Set Environment Variables in Netlify:**
   - Go to your Netlify site dashboard
   - Navigate to **Site settings** → **Environment variables**
   - Add the following variables:

     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

2. **Get Your Supabase Credentials:**
   - Log in to [Supabase Dashboard](https://app.supabase.com/)
   - Select your project
   - Go to **Settings** → **API**
   - Copy the **Project URL** and **anon public** key

3. **Redeploy Your Site:**
   - After setting the environment variables, trigger a new deployment
   - Either push a new commit or manually redeploy from Netlify dashboard

### ❌ Build Error: ESLint Warnings

**Problem:** ESLint warnings about using `<img>` instead of Next.js `<Image>` component.

**Warning Message:**

```text
Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using Next.js `<Image>` component.
```

**Solution:**

These are warnings, not errors, and won't prevent deployment. To fix:

1. Replace `<img>` tags with Next.js `<Image>` component:

   ```tsx
   import Image from 'next/image'
   
   // Instead of:
   <img src="/image.jpg" alt="Description" />
   
   // Use:
   <Image src="/image.jpg" alt="Description" width={400} height={300} />
   ```

### ❌ Build Error: Missing Dependencies

**Problem:** Required packages are not installed.

**Solution:**

1. Ensure all dependencies are in `package.json`
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. Commit the updated `package-lock.json`

### ✅ Environment Variables Checklist

Before deploying to Netlify, ensure you have:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` set in Netlify environment variables
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Netlify environment variables
- [ ] Both variables are marked as available to the build process
- [ ] Variables match exactly what's in your local `.env.local` file

### 🔍 Debugging Tips

1. **Check Environment Variables:**

   ```bash
   # In your local environment
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

2. **Test Local Build:**

   ```bash
   npm run build
   ```
   
   This should succeed locally if environment variables are set correctly.

3. **Use Debug Page:**
   Visit `/debug` on your deployed site to check if environment variables are properly set.

### 📞 Support

If you continue to have issues:

1. Check the [Netlify deployment logs](https://docs.netlify.com/configure-builds/get-started/#access-build-logs)
2. Verify your Supabase project is active and accessible
3. Ensure your `.env.example` file is up to date

## Deployment Platforms

### Netlify

- Set environment variables in Site settings → Environment variables
- Use the Next.js plugin: `@netlify/plugin-nextjs`

### Vercel

- Set environment variables in Project settings → Environment Variables
- Vercel automatically detects Next.js projects

### Other Platforms

- Ensure the platform supports Next.js 15
- Set the build command to `npm run build`
- Set the output directory to `.next`
