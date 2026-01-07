# Vercel Deployment Guide

## ⚠️ Important Notes

This application was originally built as an **Electron desktop application**. Deploying to Vercel requires some modifications:

### Limitations:
1. **SQLite Database**: SQLite file-based databases won't work on Vercel's serverless functions. You'll need to use a cloud database.
2. **Puppeteer**: PDF generation with Puppeteer may not work well in serverless environment (large bundle size, cold starts).
3. **File System**: No persistent file system in serverless functions.

## 🔧 Required Changes for Vercel

### Option 1: Use Cloud Database (Recommended)

Replace SQLite with one of these:
- **Vercel Postgres** (Recommended for Vercel)
- **Supabase** (Free tier available)
- **PlanetScale** (MySQL compatible)
- **MongoDB Atlas** (NoSQL option)

### Option 2: Use Vercel KV (Redis) for simple data

For lightweight data storage.

## 📋 Deployment Steps

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
vercel
```

Or deploy to production:

```bash
vercel --prod
```

### 4. Environment Variables

Set these in Vercel dashboard or via CLI:

```bash
vercel env add DATABASE_URL
vercel env add NODE_ENV production
```

## 🗄️ Database Migration

### Using Vercel Postgres (Recommended)

1. **Add Vercel Postgres**:
   - Go to your Vercel project dashboard
   - Navigate to Storage tab
   - Add Vercel Postgres database

2. **Update database.js**:
   ```javascript
   // Replace SQLite with Postgres
   const { createClient } = require('@vercel/postgres');
   const client = createClient();
   ```

3. **Update queries**:
   - Convert SQLite syntax to PostgreSQL
   - Update connection strings

### Using Supabase (Alternative)

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string
4. Update database connection in `database/database.js`

## 📝 Current Vercel Setup

The project includes:
- `vercel.json` - Vercel configuration
- `api/` directory - Serverless functions
- Static file serving for HTML and assets

## 🚀 Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
```

## 🔍 Testing Locally

```bash
# Install Vercel CLI
npm i -g vercel

# Run Vercel dev server
vercel dev
```

## ⚙️ Configuration Files

- `vercel.json` - Routing and build configuration
- `api/*.js` - Serverless function handlers

## 📚 Next Steps

1. **Choose a database**: Vercel Postgres or Supabase
2. **Update database.js**: Replace SQLite with chosen database
3. **Test locally**: `vercel dev`
4. **Deploy**: `vercel --prod`

## 🐛 Troubleshooting

### Issue: Database connection errors
**Solution**: Ensure you're using a cloud database, not SQLite

### Issue: Puppeteer not working
**Solution**: Consider using alternative PDF generation:
- `pdfkit` (already included)
- `jsPDF` (client-side)
- External PDF service API

### Issue: Large bundle size
**Solution**: 
- Remove unused dependencies
- Use dynamic imports
- Consider splitting functions

## 📞 Support

For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

