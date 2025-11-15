# 🚀 Quick Deployment Checklist

Use this checklist to deploy QuickOnboardDoc to Vercel in under 10 minutes!

## Before You Start

### ✅ Accounts Needed
- [ ] GitHub account
- [ ] Vercel account (sign up at vercel.com)
- [ ] Google Cloud Console (for OAuth)
- [ ] Google AI Studio (for Gemini API)
- [ ] Resend account (for emails)

## Deployment Steps

### 1️⃣ Push to GitHub (2 min)
```bash
cd quickonboarddoc
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/quickonboarddoc.git
git push -u origin main
```

### 2️⃣ Deploy to Vercel (1 min)
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Click **Deploy** (will fail - that's expected!)

### 3️⃣ Set Up Database (2 min)
**In Vercel Dashboard:**
1. Go to Storage → Create Database → **Postgres**
2. Copy the `DATABASE_URL`
3. Go to Settings → Environment Variables
4. Add `DATABASE_URL` (Production, Preview, Development)

### 4️⃣ Add Environment Variables (3 min)
**In Vercel: Settings → Environment Variables**

Add these (copy from your `.env` file):

```env
# Database (from Vercel Postgres)
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=run: openssl rand -base64 32
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# AI
GEMINI_API_KEY=your-gemini-key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your-langchain-key
LANGCHAIN_PROJECT=quickonboarddoc-prod
LANGCHAIN_ENDPOINT=https://eu.api.smith.langchain.com

# Email
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
CONTACT_EMAIL=support@yourdomain.com

# Blob Storage (auto-populated if you created blob in Vercel)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### 5️⃣ Update Google OAuth (1 min)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Edit OAuth 2.0 Client
4. Add redirect URI:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

### 6️⃣ Redeploy (1 min)
**In Vercel Dashboard:**
1. Go to Deployments
2. Click ⋯ on latest deployment
3. Click **Redeploy**

## Post-Deployment Testing

### ✅ Test These Features
- [ ] Homepage loads
- [ ] Sign up with email
- [ ] Sign in with Google
- [ ] Create workspace
- [ ] Upload document
- [ ] Ask AI a question
- [ ] Send contact form
- [ ] Invite team member

## Common Issues & Fixes

### ❌ Build Fails
**Error:** "Cannot find module 'prisma'"
**Fix:** Prisma should auto-generate via `postinstall` script

### ❌ Database Connection Error
**Error:** "Can't reach database server"
**Fix:** 
1. Check `DATABASE_URL` is correct
2. Ensure it ends with `?sslmode=require`
3. Verify Vercel Postgres is active

### ❌ OAuth Not Working
**Error:** "Redirect URI mismatch"
**Fix:**
1. Update Google OAuth redirect URIs
2. Ensure `NEXTAUTH_URL` matches your domain
3. Clear browser cache and try again

### ❌ Document Upload Fails
**Error:** "Missing BLOB_READ_WRITE_TOKEN"
**Fix:**
1. Go to Vercel → Storage → Blob
2. Copy the token
3. Add to environment variables
4. Redeploy

## Quick Commands

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Check deployment status
vercel inspect https://your-app.vercel.app

# View real-time logs
vercel logs --follow

# Pull environment variables locally
vercel env pull
```

## Success! 🎉

Your app is live at: **https://your-app.vercel.app**

### Next Steps:
1. ✅ Add custom domain (optional)
2. ✅ Set up monitoring
3. ✅ Configure backups
4. ✅ Share with your team!

---

**Need help?** Check `DEPLOYMENT.md` for detailed instructions.
