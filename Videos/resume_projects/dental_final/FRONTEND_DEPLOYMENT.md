# Frontend Deployment to Vercel

## 🚀 Quick Deploy (Frontend Only)

This guide shows how to deploy just the frontend static files to Vercel.

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional, for CLI deployment):
   ```bash
   npm i -g vercel
   ```

### Deployment Methods

#### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub

2. **Import Your Repository**
   - Click "Import Git Repository"
   - Select `welldent` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: Leave empty

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live at `https://your-project.vercel.app`

#### Method 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

### 📁 What Gets Deployed

- ✅ All HTML files from `html/` directory
- ✅ All CSS files from `assets/css/`
- ✅ All images from `assets/images/`
- ✅ JavaScript files (client-side only)

### ⚠️ Important Notes

1. **API Calls Won't Work**: 
   - The frontend makes API calls to `http://localhost:3000`
   - These will fail on Vercel since there's no backend
   - You'll need to either:
     - Remove API functionality
     - Point to an external API
     - Use mock data for demo purposes

2. **Static Files Only**:
   - No server-side processing
   - No database connections
   - Pure HTML/CSS/JavaScript

### 🔧 Custom Domain

After deployment, you can add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

### 📝 URL Structure

Your deployed site will have these URLs:
- `https://your-project.vercel.app/` → Home page
- `https://your-project.vercel.app/patients` → Patients page
- `https://your-project.vercel.app/register` → Register page
- `https://your-project.vercel.app/materials` → Materials page
- And so on...

### 🎨 Features That Will Work

- ✅ All HTML pages
- ✅ Navigation between pages
- ✅ CSS styling
- ✅ Client-side JavaScript
- ✅ Static images and assets

### ❌ Features That Won't Work

- ❌ API calls to backend
- ❌ Database operations
- ❌ PDF generation (requires backend)
- ❌ Data persistence
- ❌ Form submissions to API

### 🛠️ Making API Calls Work (Optional)

If you want the frontend to work with a backend:

1. **Deploy Backend Separately**:
   - Deploy API to another service (Railway, Render, etc.)
   - Update API URLs in HTML files

2. **Use Environment Variables**:
   - Set `API_URL` in Vercel environment variables
   - Update frontend to use `process.env.API_URL`

3. **Mock Data**:
   - Replace API calls with mock data
   - Use static JSON files

### 📦 Project Structure for Vercel

```
welldent/
├── html/              # Served as static files
│   ├── home.html
│   ├── patients.html
│   └── ...
├── assets/            # Static assets
│   ├── css/
│   └── images/
└── vercel.json        # Vercel configuration
```

### ✅ Deployment Checklist

- [x] vercel.json configured
- [x] All HTML files in html/ directory
- [x] All assets in assets/ directory
- [ ] (Optional) Update API URLs if using external backend
- [ ] (Optional) Add environment variables
- [ ] Deploy to Vercel

### 🎉 After Deployment

Once deployed, you'll get:
- ✅ Live URL (e.g., `https://welldent.vercel.app`)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on git push (if connected)

### 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:
1. Push changes to `main` branch
2. Vercel detects changes
3. Automatically builds and deploys
4. Your site updates in seconds!

---

**Need Help?** Check [Vercel Documentation](https://vercel.com/docs)

