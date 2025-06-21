# � **URGENT FIX**: Netlify Environment Variables Setup

## 🔥 Quick Fix for Runtime Error: "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"

### **❌ Current Error**
```
Uncaught Error: Missing environment variable: NEXT_PUBLIC_SUPABASE_URL
```

### **✅ Immediate Solution**

#### **Step 1: Access Netlify Dashboard**
1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Select your **Family Memories** site
3. Navigate to **Site settings** → **Environment variables**

#### **Step 2: Add Required Variables**
Click **"Add variable"** and add these **EXACT** values:

**🔑 Variable 1:**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://mwzalxctdbpnourkyjcp.supabase.co
```

**🔑 Variable 2:**
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13emFseGN0ZGJwbm91cmt5amNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDgxMjksImV4cCI6MjA2NjAyNDEyOX0.2MqMydh03ErT7tt9keSSb-XgphJOzNG3ztxsmvH87EA
```

#### **Step 3: Redeploy**
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete (usually 2-3 minutes)

---

## 🔍 Alternative Methods

### **Method A: Using Netlify CLI**
```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login and set variables
netlify login
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://mwzalxctdbpnourkyjcp.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13emFseGN0ZGJwbm91cmt5amNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NDgxMjksImV4cCI6MjA2NjAyNDEyOX0.2MqMydh03ErT7tt9keSSb-XgphJOzNG3ztxsmvH87EA"

# Deploy
netlify deploy --prod
```

### **Method B: From Git Provider (GitHub/GitLab)**
If your repository is connected:
1. Set environment variables in Netlify Dashboard (Steps 1-2 above)
2. Push any small change to trigger auto-deploy:
   ```bash
   git commit --allow-empty -m "Trigger redeploy for env vars"
   git push origin main
   ```

---

## ✅ **Verification Steps**

### **1. Check Deployment Logs**
- In Netlify Dashboard → **Deploys** → Click latest deploy
- Look for "Environment variables loaded" or similar message
- Ensure no environment variable errors in build logs

### **2. Test Live Site**
- Visit your deployed site URL
- Open browser dev tools (F12)
- Check Console tab - should see no Supabase errors
- Try navigating to different pages

### **3. Local Testing (Optional)**
```bash
# Verify local environment still works
npm run dev
# Should start without errors at http://localhost:3000
```

---

## 🚨 **Common Issues & Fixes**

| Issue | Solution |
|-------|----------|
| ❌ Variables not showing in build | Clear site cache: **Site settings** → **Build & deploy** → **Post processing** → **Snippet injection** → **Clear cache** |
| ❌ Still getting runtime errors | Double-check variable names are EXACTLY: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| ❌ Build succeeds but runtime fails | Ensure variables start with `NEXT_PUBLIC_` (required for client-side access) |
| ❌ Deployment not triggered | Manually trigger: **Deploys** → **Trigger deploy** → **Deploy site** |

---

## 📱 **Expected Result**

After following these steps:
- ✅ No more "Missing environment variable" errors
- ✅ Site loads properly on Netlify URL
- ✅ All pages and features work as expected
- ✅ Console shows no Supabase connection errors

---

**🕒 Total Fix Time: ~5 minutes**
- ❌ **Variables not showing up?** Make sure they're set in Netlify (not GitHub/other platforms)
- ❌ **Build still failing?** Check the full deployment log in Netlify for other issues

## Additional Resources

- [Full Deployment Troubleshooting Guide](./DEPLOYMENT_TROUBLESHOOTING.md)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Netlify Environment Variables Documentation](https://docs.netlify.com/environment-variables/overview/)
