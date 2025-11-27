# Vercel Deployment Configuration

## Important Settings

When setting up the project in Vercel, make sure to configure:

### Root Directory
Set the **Root Directory** to: `apps/frontend`

This tells Vercel where your Next.js app is located.

### Build Settings (Alternative to vercel.json)

If you prefer to set in Vercel dashboard instead of using vercel.json:

- **Framework Preset**: Next.js
- **Root Directory**: `apps/frontend`
- **Build Command**: `npm run build` (runs in apps/frontend)
- **Output Directory**: `.next` (relative to apps/frontend)
- **Install Command**: `npm install --legacy-peer-deps`

## Current vercel.json Configuration

```json
{
  "buildCommand": "cd apps/frontend && npm run build",
  "outputDirectory": "apps/frontend/.next",
  "installCommand": "cd apps/frontend && npm install --legacy-peer-deps",
  "framework": "nextjs"
}
```

## Environment Variables

Make sure to set these in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` (if different from default)

## Troubleshooting

If you still get "No Next.js version detected":

1. Go to Vercel Dashboard → Project Settings → General
2. Check that **Root Directory** is set to `apps/frontend`
3. Clear build cache and redeploy
4. Verify that `apps/frontend/package.json` contains `"next"` in dependencies


