# Exilium Deployment Guide

## Prerequisites

- Vercel account (for frontend)
- Railway account (for FastAPI backend)
- Supabase account (for auth + database)
- Domain: exilium.world

## 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Note these values from **Settings > API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `JWT Secret` → `SUPABASE_JWT_SECRET` (for backend)

3. Enable Email auth in **Authentication > Providers**

## 2. Railway Backend Deployment

1. Create new project at [railway.app](https://railway.app)
2. Connect to GitHub repo or deploy from CLI:
   ```bash
   cd /home/ekarus/InitTracker/backend
   railway login
   railway init
   railway up
   ```

3. Add environment variables in Railway dashboard:
   ```
   DATABASE_URL=postgresql://... (Railway provides PostgreSQL addon)
   SUPABASE_JWT_SECRET=<from step 1>
   CORS_ORIGINS=https://exilium.world,http://localhost:3000
   ```

4. Add PostgreSQL addon in Railway
5. Note the deployed URL (e.g., `https://inittracker-production.up.railway.app`)

## 3. Database Migration

SSH into Railway or run locally with production DATABASE_URL:
```bash
cd /home/ekarus/InitTracker/backend
alembic upgrade head
```

## 4. Vercel Frontend Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd /home/ekarus/exilium/web
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<from step 1>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<from step 1>
   TRACKER_API_URL=<Railway URL from step 2>
   ```

4. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

## 5. Domain Configuration

1. In Vercel dashboard, go to **Settings > Domains**
2. Add `exilium.world`
3. Update DNS records at your registrar:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`

## 6. Verification

1. Visit https://exilium.world - landing page loads
2. Browse `/player/geography/veraheim` - content shows
3. Open `/tools/tracker` - tracker loads (may show "backend not connected" if no data)
4. Sign up - email confirmation works
5. Create encounter in tracker - data persists

## Environment Variables Summary

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `TRACKER_API_URL` | Railway backend URL |

### Backend (Railway)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SUPABASE_JWT_SECRET` | For validating auth tokens |
| `CORS_ORIGINS` | Comma-separated allowed origins |

## Updating Content

Content is built at deploy time from the Obsidian vault. To update:

1. Push changes to the vault (if synced to git)
2. Or update files locally and redeploy:
   ```bash
   npm run build:content
   vercel --prod
   ```

## Troubleshooting

### "Failed to connect to backend"
- Check TRACKER_API_URL is set correctly in Vercel
- Verify Railway backend is running
- Check CORS_ORIGINS includes your frontend domain

### Auth not working
- Verify Supabase URL and anon key are correct
- Check Supabase email provider is enabled

### Database errors
- Run `alembic upgrade head` on production database
- Check DATABASE_URL format is correct
