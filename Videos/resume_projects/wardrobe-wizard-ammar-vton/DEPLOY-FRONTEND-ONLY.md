# 🚀 Deploy Frontend Only to Render

This guide will help you deploy just the React frontend as a static site on Render.

## Step 1: Prepare Your Code

Make sure all changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Deploy frontend to Render"
git push origin main
```

## Step 2: Deploy on Render

### Option A: Using render-frontend-only.yaml (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
   - Sign up or log in with GitHub

2. **Create New Static Site**:
   - Click "New +" button (top right)
   - Select "Static Site"
   - Connect your GitHub account if not already connected
   - Select your repository: `wardrobe-wizard-ammar-vton`
   - Render will auto-detect it's a static site

3. **Configure the Static Site**:
   - **Name**: `wardrobe-wizard-frontend` (or any name you prefer)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (or `.` if needed)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free (or choose a paid plan)

4. **Set Environment Variables** (IMPORTANT!):

   Click "Advanced" → "Add Environment Variable" and add:

   - **REACT_APP_API_URL** = Your backend API URL
     - Example: `https://your-backend.onrender.com`
     - Or: `http://localhost:5001` (if testing locally)
   
   - **REACT_APP_PYTHON_API_URL** = Your Python service URL (for virtual try-on)
     - Example: `https://your-python-service.onrender.com`
     - Or: `http://localhost:5000` (if testing locally)

   **Note**: If you don't have backend services yet, you can:
   - Use placeholder URLs and update later
   - Or deploy the backend services first (see `DEPLOY-NOW.md`)

5. **Create Static Site**:
   - Click "Create Static Site"
   - Wait 3-5 minutes for the build to complete

### Option B: Manual Configuration

1. Go to https://dashboard.render.com
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Fill in the configuration:
   - **Name**: `wardrobe-wizard-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
5. Add environment variables (same as above)
6. Click "Create Static Site"

## Step 3: Get Your Frontend URL

After deployment completes, you'll get a URL like:
- `https://wardrobe-wizard-frontend.onrender.com`

Your React app will be live at this URL! 🎉

## Step 4: Test Your Deployment

1. Visit your frontend URL
2. Check the browser console for any errors
3. Test the features that connect to your backend

## Environment Variables Reference

### Required Variables

- **REACT_APP_API_URL**: Your backend API URL
  - Format: `https://your-backend.onrender.com` or `http://localhost:5001`
  - Used for: Product data, user authentication, cart, wishlist

- **REACT_APP_PYTHON_API_URL**: Your Python service URL
  - Format: `https://your-python-service.onrender.com` or `http://localhost:5000`
  - Used for: Virtual try-on feature

### How to Update Environment Variables

1. Go to your static site in Render dashboard
2. Click on "Environment" tab
3. Add or edit environment variables
4. Save changes (Render will automatically rebuild)

## Important Notes

### ⚠️ CORS Configuration

Make sure your backend services have CORS enabled to allow requests from your frontend domain:

```javascript
// In your backend server.js
app.use(cors({
  origin: ['https://wardrobe-wizard-frontend.onrender.com', 'http://localhost:3000']
}));
```

### 🔄 Auto-Deploy

- Render automatically redeploys when you push to GitHub (if enabled)
- You can disable auto-deploy in Settings if needed

### 📝 Custom Domain

You can add a custom domain:
1. Go to your static site in Render
2. Click "Settings" → "Custom Domain"
3. Add your domain

### 🆓 Free Tier

- Static sites on free tier are always available (no spin-down)
- Builds are free
- Bandwidth limits apply (check Render docs)

## Troubleshooting

### Build Fails

- **Check build logs** in Render dashboard
- **Verify Node.js version** - Render uses Node 18+ by default
- **Check dependencies** - Make sure all are in `package.json`

### API Calls Not Working

- **Check environment variables** are set correctly
- **Verify backend CORS** allows your frontend domain
- **Check browser console** for CORS or network errors
- **Test API URLs** directly in browser

### 404 Errors on Page Refresh

- This is handled by the `routes` configuration in `render-frontend-only.yaml`
- If issues persist, check that `staticPublishPath` is set to `build`

### Environment Variables Not Working

- **Rebuild required**: Environment variables are baked into the build
- After changing env vars, Render will auto-rebuild
- Wait for build to complete before testing

## Next Steps

1. ✅ Deploy frontend (you're doing this now!)
2. Deploy backend services (if not already done)
   - See `DEPLOY-NOW.md` for full stack deployment
3. Update environment variables with actual service URLs
4. Test all features end-to-end

## Quick Reference

**Frontend URL**: `https://wardrobe-wizard-frontend.onrender.com`

**To update after deployment**:
- Push code → Auto-redeploys
- Change env vars → Auto-rebuilds
- Check logs → Render dashboard → Your service → Logs

Your frontend is now live! 🚀

