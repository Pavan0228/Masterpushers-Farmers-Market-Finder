# Vercel Deployment Guide

This project is configured to deploy both frontend and backend on Vercel as a monorepo.

## Setup Complete ✅

The following files have been created/updated:
- ✅ `vercel.json` - Vercel configuration
- ✅ `api/index.js` - Serverless function entry point
- ✅ `backend/db/index.js` - Updated for serverless connection pooling
- ✅ `backend/app.js` - Updated exports for serverless
- ✅ `frontend/config.js` - Updated to use environment variables
- ✅ `frontend/package.json` - Added vercel-build script
- ✅ `.vercelignore` - Excludes unnecessary files

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
From the root directory:
```bash
vercel
```

Or deploy directly from the Vercel dashboard:
1. Go to https://vercel.com
2. Click "New Project"
3. Import your Git repository
4. Configure the project (see below)

## Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

### Backend Variables:
- `MONGO_URI` - Your MongoDB connection string
- `MONGO_DB_NAME` - Your MongoDB database name
- `CORS_ORIGIN` - Your Vercel frontend URL (e.g., `https://your-project.vercel.app`)
- `JWT_SECRET` - Your JWT secret key
- `GOOGLE_MAPS_API_KEY` - Your Google Maps API key
- `PORT` - (Optional, Vercel handles this automatically)

### Frontend Variables:
- `VITE_API_URL` - Your backend API URL (e.g., `https://your-project.vercel.app/api`)
  - Or leave empty to use relative URLs (recommended)

### Additional Variables (if needed):
- AWS S3 credentials (if using file uploads)
- Razorpay keys (if using payment gateway)
- Any other environment variables your app uses

## Project Configuration in Vercel

When setting up in Vercel Dashboard:
- **Root Directory**: Leave as default (root of repo)
- **Build Command**: Will use `frontend/package.json` automatically
- **Output Directory**: `frontend/dist` (configured in vercel.json)
- **Install Command**: `npm install` (will install both frontend and backend dependencies)

## How It Works

1. **Frontend**: Vite builds the React app to `frontend/dist`
2. **Backend**: Express app runs as serverless functions in `/api` folder
3. **Routing**: 
   - `/api/*` routes → Serverless functions
   - `/*` routes → Frontend static files

## Important Notes

1. **MongoDB Connection**: The database connection is cached for serverless functions to improve performance
2. **CORS**: Make sure to set `CORS_ORIGIN` to your production frontend URL
3. **API URLs**: The frontend will use relative URLs in production (same domain), so no need to set `VITE_API_URL` unless deploying separately
4. **Cold Starts**: Serverless functions may have cold starts. Consider using Vercel Pro for better performance

## Troubleshooting

### Build Fails
- Check that all dependencies are listed in `package.json`
- Verify Node.js version compatibility
- Check build logs in Vercel dashboard

### API Routes Not Working
- Verify environment variables are set correctly
- Check that MongoDB connection string is correct
- Verify CORS_ORIGIN matches your frontend URL

### Frontend Can't Connect to Backend
- Ensure `CORS_ORIGIN` is set correctly
- Check that API routes are prefixed with `/api`
- Verify `frontend/config.js` is using the correct API URL

## Testing Locally

To test the Vercel setup locally:
```bash
vercel dev
```

This will run the project locally with Vercel's serverless functions.

