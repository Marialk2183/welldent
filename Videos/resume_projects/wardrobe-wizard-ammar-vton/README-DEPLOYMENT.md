# Deployment Guide for Render

This guide will help you deploy the Wardrobe Wizard application to Render.

## Prerequisites

1. A GitHub account with this repository
2. A Render account (sign up at https://render.com)
3. A MongoDB Atlas account (for production database) or use Render's MongoDB service
4. A RapidAPI account with API key for virtual try-on feature

## Deployment Steps

### 1. Set up MongoDB Database

1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas) or use Render's MongoDB service
2. Create a new cluster
3. Get your connection string (MONGO_URI)
4. Whitelist Render's IP addresses (or use 0.0.0.0/0 for all IPs)

### 2. Deploy Backend Service (Node.js/Express)

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `wardrobe-wizard-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start:server`
   - **Plan**: Free (or choose a paid plan)

4. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render sets this automatically, but good to have)
   - `MONGO_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Generate a random secret key (you can use Render's "Generate" button)

5. Click "Create Web Service"
6. Note the service URL (e.g., `https://wardrobe-wizard-backend.onrender.com`)

### 3. Deploy Python Service (Flask)

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `wardrobe-wizard-python`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r server/python_server/requirements.txt`
   - **Start Command**: `cd server/python_server && gunicorn app:app`
   - **Plan**: Free (or choose a paid plan)

4. Add Environment Variables:
   - `PORT` = `10000`
   - `RAPIDAPI_KEY` = Your RapidAPI key

5. Click "Create Web Service"
6. Note the service URL (e.g., `https://wardrobe-wizard-python.onrender.com`)

### 4. Deploy Frontend (React Static Site)

1. In Render dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure the site:
   - **Name**: `wardrobe-wizard-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free (or choose a paid plan)

4. Add Environment Variables:
   - `REACT_APP_API_URL` = Your backend service URL (e.g., `https://wardrobe-wizard-backend.onrender.com`)
   - `REACT_APP_PYTHON_API_URL` = Your Python service URL (e.g., `https://wardrobe-wizard-python.onrender.com`)

5. Click "Create Static Site"

### 5. Alternative: Use render.yaml (Recommended)

Instead of manually creating each service, you can use the `render.yaml` file:

1. In Render dashboard, click "New +" → "Blueprint"
2. Connect your GitHub repository
3. Render will automatically detect `render.yaml` and create all services
4. You'll need to set the environment variables in the Render dashboard:
   - `MONGO_URI` (for backend service)
   - `RAPIDAPI_KEY` (for Python service)
   - `REACT_APP_API_URL` and `REACT_APP_PYTHON_API_URL` (for frontend)

## Environment Variables Summary

### Backend Service
- `NODE_ENV` = `production`
- `PORT` = `10000` (auto-set by Render)
- `MONGO_URI` = Your MongoDB connection string
- `JWT_SECRET` = Random secret key

### Python Service
- `PORT` = `10000` (auto-set by Render)
- `RAPIDAPI_KEY` = Your RapidAPI key

### Frontend Service
- `REACT_APP_API_URL` = Backend service URL
- `REACT_APP_PYTHON_API_URL` = Python service URL

## Important Notes

1. **Free Tier Limitations**: 
   - Services on the free tier spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - Consider upgrading to a paid plan for production use

2. **CORS Configuration**: 
   - The backend already has CORS enabled
   - Make sure your frontend URL is allowed if you add specific origins

3. **Static Files**: 
   - T-shirt images should be in `public/res/tshirt/` directory
   - Make sure to commit these files to your repository

4. **Health Checks**: 
   - Backend has a health check at `/api/health`
   - Python service health check is at `/api/try-on` (may need adjustment)

5. **Build Time**: 
   - First deployment may take 5-10 minutes
   - Subsequent deployments are faster

## Troubleshooting

1. **Build Failures**: Check the build logs in Render dashboard
2. **Connection Errors**: Verify environment variables are set correctly
3. **CORS Errors**: Ensure frontend URL is correct in environment variables
4. **Database Connection**: Verify MONGO_URI and IP whitelist settings
5. **Python Service**: Check that gunicorn is installed and working

## Updating Your Deployment

1. Push changes to your GitHub repository
2. Render will automatically detect changes and redeploy
3. You can also manually trigger a deploy from the Render dashboard

