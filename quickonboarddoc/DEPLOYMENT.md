# 🚀 Deploy QuickOnboardDoc to Vercel

Complete guide to deploy your app to production on Vercel.

## Pre-Deployment Checklist

### ✅ Required Services
- [ ] Vercel account (free tier works!)
- [ ] PostgreSQL database (Vercel Postgres or external)
- [ ] Google OAuth credentials (for Google sign-in)
- [ ] Gemini API key (for AI features)
- [ ] Resend account (for emails)
- [ ] Vercel Blob storage (already set up!)

## Step-by-Step Deployment

### 1. Prepare Your Database

**Option A: Vercel Postgres (Recommended)**
1. Go to https://vercel.com/dashboard
2. Select your project → Storage → Create Database
3. Choose **Postgres**
4. Copy the connection strings

**Option B: External PostgreSQL**
- Neon, Supabase, Railway, or any PostgreSQL provider
- Get your `DATABASE_URL` connection string

### 2. Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for deployment"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/quickonboarddoc.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

**Via Vercel Dashboard:**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `quickonboarddoc` (if in subdirectory)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

4. Click **Deploy** (it will fail first - that's okay!)

### 4. Configure Environment Variables

Go to your Vercel project → Settings → Environment Variables

Add these variables for **Production**, **Preview**, and **Development**:

#### Database
```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

#### NextAuth
```env
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

#### AI & RAG
```env
GEMINI_API_KEY=your-gemini-api-key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your-langchain-api-key
LANGCHAIN_PROJECT=quickonboarddoc-production
LANGCHAIN_ENDPOINT=https://eu.api.smith.langchain.com
```

#### Email (Resend)
```env
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
CONTACT_EMAIL=support@yourdomain.com
```

#### Vercel Blob
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token
```
*(This should auto-populate if you created blob storage in Vercel)*

### 5. Run Database Migrations

After adding environment variables:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy
npx prisma generate
```

**Or via Vercel Dashboard:**
1. Go to Settings → Functions
2. Add a one-time deployment script:
   ```bash
   npx prisma migrate deploy && npx prisma generate
   ```

### 6. Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project → APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   https://your-app-preview.vercel.app/api/auth/callback/google
   ```

### 7. Redeploy

```bash
# Trigger a new deployment
vercel --prod

# Or push to GitHub (auto-deploys)
git push origin main
```

## Post-Deployment

### ✅ Verify Everything Works

1. **Homepage:** https://your-app.vercel.app
2. **Sign Up:** Create a test account
3. **Google OAuth:** Test Google sign-in
4. **Create Workspace:** Set up a test workspace
5. **Upload Document:** Upload a PDF and verify it processes
6. **AI Chat:** Ask questions about your document
7. **Contact Form:** Send a test message
8. **Invite Member:** Test workspace invitations

### 🔧 Troubleshooting

**Build Fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript has no errors: `npm run build` locally

**Database Connection Fails:**
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- Ensure SSL mode is enabled: `?sslmode=require`

**OAuth Not Working:**
- Verify redirect URIs in Google Console
- Check `NEXTAUTH_URL` matches your domain
- Ensure `NEXTAUTH_SECRET` is set

**Document Upload Fails:**
- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check Vercel Blob storage is enabled
- Review function logs in Vercel dashboard

**AI Chat Not Working:**
- Verify `GEMINI_API_KEY` is valid
- Check API quotas in Google AI Studio
- Review function logs for errors

## Performance Optimization

### Enable Edge Runtime (Optional)
For faster response times, you can enable Edge Runtime for API routes:

```typescript
// app/api/chat/route.ts
export const runtime = 'edge'; // Add this line
```

### Configure Caching
Add caching headers for static assets in `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/uploads/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

## Monitoring

### Set Up Monitoring
1. **Vercel Analytics:** Enable in project settings
2. **Error Tracking:** Consider Sentry integration
3. **Uptime Monitoring:** Use UptimeRobot or similar

### View Logs
```bash
# Real-time logs
vercel logs --follow

# Function logs
vercel logs --function=api/chat
```

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to your custom domain
5. Update Google OAuth redirect URIs

## Scaling

**Free Tier Limits:**
- 100 GB bandwidth/month
- 100 GB-hours compute
- 1 GB Blob storage
- 1 GB Postgres storage

**When to Upgrade:**
- More than 10k monthly visitors → Pro ($20/month)
- Need more storage → Upgrade Blob/Postgres
- Need faster builds → Pro plan

## Security Checklist

- [ ] All environment variables are set
- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Database uses SSL connections
- [ ] OAuth redirect URIs are restricted
- [ ] API keys are not exposed in client code
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled (consider Vercel Edge Config)

## Backup Strategy

### Database Backups
```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Or use Vercel Postgres backups (Pro plan)
```

### Blob Storage
- Vercel Blob has built-in redundancy
- Consider periodic exports for critical files

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

## Quick Commands

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# View logs
vercel logs

# Pull env variables
vercel env pull

# Run migrations
npx prisma migrate deploy

# Check deployment status
vercel inspect [deployment-url]
```

---

🎉 **Congratulations!** Your QuickOnboardDoc app is now live on Vercel!

Share your deployment URL and start onboarding new hires with AI! 🚀
