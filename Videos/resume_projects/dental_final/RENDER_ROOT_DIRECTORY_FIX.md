# Fix Render "Could not read package.json" Error

## 🔍 Problem
Render error: `Could not read package.json: Error: ENOENT: no such file or directory, open '/opt/render/project/src/package.json'`

This means Render is looking for `package.json` in the wrong directory.

## ✅ Solution: Set Root Directory in Render Dashboard

### Step 1: Go to Render Dashboard
1. Open [dashboard.render.com](https://dashboard.render.com)
2. Click on your service (`welldent-clinic-frontend`)

### Step 2: Update Settings
1. Go to **Settings** tab
2. Scroll down to **Build & Deploy**
3. Find **Root Directory** field
4. Set it to: **`.`** (dot - means root directory)
   - OR if your project is in a subdirectory, set it to that path
   - For example: `Videos/resume_projects/dental_final` (if that's where package.json is)

### Step 3: Verify File Structure
Check your GitHub repository structure:
- Go to [github.com/Marialk2183/welldent](https://github.com/Marialk2183/welldent)
- Verify where `package.json` is located
- If it's in the root, use `.` as Root Directory
- If it's in a subdirectory, use that path

### Step 4: Save and Redeploy
1. Click **Save Changes**
2. Go to **Manual Deploy** → **Deploy latest commit**
3. Wait for deployment

## ✅ Alternative: Check Repository Structure

If `package.json` is not at the repository root:

### Option 1: Move package.json to Root
Make sure `package.json` is at the repository root (same level as `.git` folder)

### Option 2: Set Correct Root Directory
In Render Dashboard → Settings → Root Directory:
- If package.json is in `dental_final/`, set Root Directory to `dental_final`
- If package.json is in root, set Root Directory to `.`

## 🔧 Quick Check

Run this to see where package.json is in your repo:
```bash
git ls-files package.json
```

This shows the path to package.json in your repository.

## 📝 Current render.yaml

I've updated `render.yaml` to include `rootDir: .` which should help, but you may still need to set it in the Render Dashboard.

## 🎯 Most Likely Fix

**In Render Dashboard:**
1. Settings → Build & Deploy
2. Root Directory: Set to `.` (or the correct subdirectory path)
3. Save and redeploy

This should fix the issue!

