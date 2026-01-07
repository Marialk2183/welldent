# 🚀 Deploy to Render - Step by Step Guide

Follow these steps to deploy your Wardrobe Wizard app to Render:

## Step 1: Prepare Your Code

Make sure all changes are committed and pushed to GitHub:

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

## Step 2: Set Up MongoDB Atlas (If You Haven't Already)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a free cluster (M0 Sandbox)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your database password
7. Add database name: `wardrobeWizardDB` (or your preferred name)
8. Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)

**Save your MongoDB connection string!** You'll need it in Step 4.

## Step 3: Get Your RapidAPI Key

1. Go to https://rapidapi.com
2. Sign up or log in
3. Find your API key in your dashboard
4. **Save your RapidAPI key!** You'll need it in Step 4.

## Step 4: Deploy to Render

### Option A: Using Blueprint (Recommended - Easiest)

1. **Go to Render Dashboard**: https://dashboard.render.com
   - Sign up or log in with GitHub

2. **Create New Blueprint**:
   - Click "New +" button (top right)
   - Select "Blueprint"
   - Connect your GitHub account if not already connected
   - Select your repository: `wardrobe-wizard-ammar-vton`
   - Click "Apply"

3. **Render will detect `render.yaml`** and create 2 services:
   - `wardrobe-wizard-backend` (Node.js)
   - `wardrobe-wizard-python` (Python)

4. **Set Environment Variables** (IMPORTANT!):

   **For `wardrobe-wizard-backend` service:**
   - Click on the service name
   - Go to "Environment" tab
   - Add these variables:
     - `MONGO_URI` = Your MongoDB connection string from Step 2
     - `JWT_SECRET` = (Click "Generate" button to auto-generate)

   **For `wardrobe-wizard-python` service:**
   - Click on the service name
   - Go to "Environment" tab
   - Add this variable:
     - `RAPIDAPI_KEY` = Your RapidAPI key from Step 3

5. **Deploy**:
   - Render will automatically start building
   - Wait 5-10 minutes for first deployment
   - Watch the build logs for any errors

### Option B: Manual Deployment

If you prefer more control, see `README-DEPLOYMENT.md` for detailed manual steps.

## Step 5: Get Your Service URLs

After deployment completes:

1. **Backend URL**: `https://wardrobe-wizard-backend.onrender.com`
   - This serves both your API and React frontend
   - Your app will be accessible at this URL

2. **Python Service URL**: `https://wardrobe-wizard-python.onrender.com`
   - This handles virtual try-on requests

## Step 6: Test Your Deployment

1. **Test Backend Health**:
   - Visit: `https://wardrobe-wizard-backend.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. **Test Your App**:
   - Visit: `https://wardrobe-wizard-backend.onrender.com`
   - Your React app should load!

3. **Test API**:
   - Visit: `https://wardrobe-wizard-backend.onrender.com/api/products`
   - Should return product data

## Step 7: Update Frontend Environment Variables (If Needed)

Since the frontend is served by the backend, the API calls will automatically use the same domain. However, if you need to configure the Python API URL:

1. In your backend service on Render
2. Go to "Environment" tab
3. Add: `REACT_APP_PYTHON_API_URL` = `https://wardrobe-wizard-python.onrender.com`
4. Redeploy the service

## ✅ You're Done!

Your app is now live on Render! 🎉

## 🔧 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Make sure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Can't Connect to MongoDB
- Double-check your `MONGO_URI` connection string
- Verify IP whitelist includes `0.0.0.0/0`
- Check MongoDB Atlas cluster is running

### Services Keep Crashing
- Check logs in Render dashboard
- Verify all environment variables are set
- Make sure ports are configured correctly (Render sets PORT automatically)

### CORS Errors
- Backend already has CORS enabled
- If issues persist, check service URLs are correct

### Python Service Not Working
- Verify `RAPIDAPI_KEY` is set correctly
- Check Python service logs
- Make sure gunicorn is installed (it's in requirements.txt)

## 📝 Important Notes

- **Free Tier**: Services spin down after 15 min of inactivity. First request after spin-down takes 30-60 seconds.
- **Custom Domain**: You can add a custom domain in Render dashboard → Settings
- **Auto-Deploy**: Render automatically redeploys when you push to GitHub (if enabled)
- **Logs**: Always check logs in Render dashboard for debugging

## 🆘 Need Help?

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Check build/deploy logs in Render dashboard

