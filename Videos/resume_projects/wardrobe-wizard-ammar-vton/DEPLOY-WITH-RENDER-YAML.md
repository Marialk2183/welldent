# 🚀 Deploy Using render.yaml - Step by Step

This guide will help you deploy all services (backend + Python + frontend) using the `render.yaml` file.

## Prerequisites

Before you start, make sure you have:

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas account and connection string
- [ ] RapidAPI key (for virtual try-on feature)
- [ ] Render account (sign up at https://render.com if needed)

## Step 1: Push Your Code to GitHub

Make sure all your changes are committed and pushed:

```bash
git add .
git commit -m "Ready for Render deployment with render.yaml"
git push origin main
```

## Step 2: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a free cluster (M0 Sandbox)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Add database name: `wardrobeWizardDB` (or your preferred name)
8. Go to "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (`0.0.0.0/0`)

**Save your MongoDB connection string!** It should look like:
```
mongodb+srv://username:password@cluster.mongodb.net/wardrobeWizardDB
```

## Step 3: Get Your RapidAPI Key

1. Go to https://rapidapi.com
2. Sign up or log in
3. Find your API key in your dashboard
4. **Save your RapidAPI key!**

## Step 4: Deploy Using render.yaml

1. **Go to Render Dashboard**: https://dashboard.render.com
   - Sign up or log in with GitHub

2. **Create New Blueprint**:
   - Click "New +" button (top right)
   - Select "Blueprint"
   - Connect your GitHub account if not already connected
   - Select your repository: `wardrobe-wizard-ammar-vton`
   - Click "Apply"

3. **Render will detect `render.yaml`**:
   - Render will automatically read the `render.yaml` file
   - It will create 2 services:
     - `wardrobe-wizard-backend` (Node.js/Express)
     - `wardrobe-wizard-python` (Python Flask)

4. **Set Environment Variables** (IMPORTANT!):

   **For `wardrobe-wizard-backend` service:**
   - Click on the service name in the list
   - Go to "Environment" tab
   - Add/Edit these variables:
     - `MONGO_URI` = Your MongoDB connection string from Step 2
     - `JWT_SECRET` = (Click "Generate" button to auto-generate, or use Render's auto-generation)
   
   **For `wardrobe-wizard-python` service:**
   - Click on the service name in the list
   - Go to "Environment" tab
   - Add/Edit this variable:
     - `RAPIDAPI_KEY` = Your RapidAPI key from Step 3

5. **Deploy**:
   - Render will automatically start building both services
   - Wait 5-10 minutes for the first deployment
   - Watch the build logs for any errors
   - You can click on each service to see its build progress

## Step 5: Get Your Service URLs

After deployment completes:

1. **Backend URL**: 
   - Go to `wardrobe-wizard-backend` service
   - Look at the top of the page
   - You'll see: `https://wardrobe-wizard-backend.onrender.com`
   - **This serves both your API and React frontend!** ✅

2. **Python Service URL**:
   - Go to `wardrobe-wizard-python` service
   - Look at the top of the page
   - You'll see: `https://wardrobe-wizard-python.onrender.com`
   - This handles virtual try-on requests

## Step 6: Test Your Deployment

1. **Test Backend Health**:
   - Visit: `https://wardrobe-wizard-backend.onrender.com/api/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. **Test Your App**:
   - Visit: `https://wardrobe-wizard-backend.onrender.com`
   - Your React app should load! 🎉

3. **Test API**:
   - Visit: `https://wardrobe-wizard-backend.onrender.com/api/products`
   - Should return product data

4. **Test Python Service** (from your frontend):
   - The virtual try-on feature should work
   - Make sure `REACT_APP_PYTHON_API_URL` is set (if deploying frontend separately)

## ✅ You're Done!

Your full-stack application is now live on Render! 🎉

- **Frontend + Backend**: `https://wardrobe-wizard-backend.onrender.com`
- **Python Service**: `https://wardrobe-wizard-python.onrender.com`

## Important Notes

### 🎯 How It Works

The `render.yaml` file tells Render to:
1. Create a Node.js web service (backend)
2. Create a Python web service (Python API)
3. The backend service also serves your React frontend (built during deployment)

### 🔄 Auto-Deploy

- Render automatically redeploys when you push to GitHub (if enabled)
- You can disable auto-deploy in Settings if needed

### 🆓 Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading to a paid plan for production use

### 📝 Updating Environment Variables

1. Go to your service in Render dashboard
2. Click "Environment" tab
3. Add or edit variables
4. Save (service will automatically redeploy)

## Troubleshooting

### Build Fails

- **Check build logs** in Render dashboard
- **Verify environment variables** are set correctly
- **Check MongoDB connection** - Verify MONGO_URI and IP whitelist

### Services Keep Crashing

- **Check logs** in Render dashboard
- **Verify all environment variables** are set
- **Check MongoDB connection** is working

### Can't Access Frontend

- **Wait for build to complete** - First build takes 5-10 minutes
- **Check backend service logs** - Make sure React build succeeded
- **Verify service is running** - Check service status in dashboard

### CORS Errors

- Backend already has CORS enabled
- Should work automatically
- If issues persist, check service URLs

## Next Steps

1. ✅ Deploy using render.yaml (you're doing this!)
2. ✅ Set environment variables
3. ✅ Test your application
4. 🎉 Share your live app!

## Quick Reference

**Your App URL**: `https://wardrobe-wizard-backend.onrender.com`

**To update**:
- Push code → Auto-redeploys
- Change env vars → Auto-redeploys
- Check logs → Render dashboard → Service → Logs

For detailed troubleshooting, see `README-DEPLOYMENT.md`

