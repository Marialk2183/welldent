# 🔍 How to Get Your API URLs for Frontend Deployment

You need to deploy your backend services first to get these URLs. Here's how:

## Option 1: Deploy Backend Services First (Recommended)

### Step 1: Deploy Backend Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `wardrobe-wizard-backend` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:server`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = Your MongoDB connection string
   - `JWT_SECRET` = (Click "Generate" to auto-generate)

6. Click "Create Web Service"
7. **Wait for deployment** (5-10 minutes)
8. **Copy the URL** - It will look like:
   ```
   https://wardrobe-wizard-backend.onrender.com
   ```
   **This is your REACT_APP_API_URL!** ✅

### Step 2: Deploy Python Service

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `wardrobe-wizard-python` (or any name)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r server/python_server/requirements.txt`
   - **Start Command**: `cd server/python_server && gunicorn app:app --bind 0.0.0.0:$PORT`
   - **Plan**: Free

4. Add Environment Variables:
   - `RAPIDAPI_KEY` = Your RapidAPI key

5. Click "Create Web Service"
6. **Wait for deployment** (5-10 minutes)
7. **Copy the URL** - It will look like:
   ```
   https://wardrobe-wizard-python.onrender.com
   ```
   **This is your REACT_APP_PYTHON_API_URL!** ✅

### Step 3: Use These URLs in Frontend

Now when deploying your frontend, use:
- `REACT_APP_API_URL` = `https://wardrobe-wizard-backend.onrender.com`
- `REACT_APP_PYTHON_API_URL` = `https://wardrobe-wizard-python.onrender.com`

## Option 2: Use Existing Backend Services

If you already have backend services deployed:

1. Go to your Render dashboard
2. Find your backend service
3. Click on it
4. Look at the top - you'll see the URL
5. Copy that URL

**Example:**
- Service name: `my-backend-service`
- URL: `https://my-backend-service.onrender.com` ← This is your API URL

## Option 3: Deploy Everything at Once (Easiest)

Use the full `render.yaml` to deploy all services together:

1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create all services
5. After deployment, you'll see all service URLs in the dashboard
6. Copy the URLs and use them for your frontend

## Where to Find URLs After Deployment

### In Render Dashboard:

1. **Go to Dashboard**: https://dashboard.render.com
2. **Click on your service** (e.g., "wardrobe-wizard-backend")
3. **Look at the top** - You'll see:
   ```
   https://wardrobe-wizard-backend.onrender.com
   ```
4. **Copy this URL** - This is what you need!

### URL Format:

All Render URLs follow this pattern:
```
https://[service-name].onrender.com
```

Where `[service-name]` is what you named your service.

## Quick Checklist

- [ ] Deploy backend service → Get `REACT_APP_API_URL`
- [ ] Deploy Python service → Get `REACT_APP_PYTHON_API_URL`
- [ ] Deploy frontend → Use the URLs above as environment variables

## Example Values

Once deployed, your environment variables will look like:

```
REACT_APP_API_URL=https://wardrobe-wizard-backend.onrender.com
REACT_APP_PYTHON_API_URL=https://wardrobe-wizard-python.onrender.com
```

## Testing Your URLs

After deployment, test your URLs:

1. **Backend Health Check**:
   ```
   https://your-backend.onrender.com/api/health
   ```
   Should return: `{"status":"ok","message":"Server is running"}`

2. **Backend API**:
   ```
   https://your-backend.onrender.com/api/products
   ```
   Should return product data

3. **Python Service**:
   ```
   https://your-python.onrender.com/api/try-on
   ```
   (This is a POST endpoint, so test from your frontend)

## Important Notes

- ⏱️ **First deployment takes 5-10 minutes**
- 🔄 **Services on free tier spin down after 15 min inactivity**
- 📝 **URLs are permanent** - They won't change unless you delete the service
- 🔒 **HTTPS is automatic** - All Render URLs use HTTPS

## Still Need Help?

If you haven't deployed backend services yet, see:
- `DEPLOY-NOW.md` - Full stack deployment guide
- `README-DEPLOYMENT.md` - Detailed deployment instructions

