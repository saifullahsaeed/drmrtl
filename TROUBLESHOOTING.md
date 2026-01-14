# Troubleshooting GitHub Pages 404 Error

## ✅ Configuration Verified
- ✅ Repository name updated to `drmrtl` in `vite.config.js`
- ✅ Base path correctly set to `/drmrtl/`
- ✅ Build works locally and generates correct paths
- ✅ 404.html is present in dist folder

## 🔍 Steps to Fix the 404 Error

### Step 1: Verify GitHub Pages Settings

1. Go to your repository: `https://github.com/saifullahsaeed/drmrtl`
2. Click **Settings** → **Pages**
3. Under **Source**, make sure it says **"GitHub Actions"** (NOT "Deploy from a branch")
4. If it's set to "Deploy from a branch", change it to **"GitHub Actions"**
5. Click **Save**

### Step 2: Check GitHub Actions Workflow

1. Go to your repository → **Actions** tab
2. Check if there's a workflow run:
   - If you see a workflow run, check if it completed successfully (green checkmark)
   - If it failed (red X), click on it to see the error
   - If there's no workflow run, you need to push the code

### Step 3: Push the Updated Configuration

If you haven't pushed the updated `vite.config.js` yet:

```bash
git add vite.config.js
git commit -m "Update repository name to drmrtl for GitHub Pages"
git push origin main  # or master, depending on your default branch
```

### Step 4: Trigger the Workflow

After pushing, the workflow should automatically run. You can also manually trigger it:

1. Go to **Actions** tab
2. Click on **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** → **"Run workflow"**

### Step 5: Wait for Deployment

- The workflow usually takes 1-3 minutes
- Wait for the workflow to complete (green checkmark)
- The deployment happens automatically after the build succeeds

### Step 6: Verify Deployment

1. Go to **Settings** → **Pages**
2. You should see: **"Your site is live at https://saifullahsaeed.github.io/drmrtl/"**
3. If you see a warning or error, check the Actions tab for details

## 🐛 Common Issues

### Issue: "No workflow runs found"
**Solution**: Make sure the `.github/workflows/deploy.yml` file exists and is committed to your repository.

### Issue: Workflow fails with "permission denied"
**Solution**: 
1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **"Read and write permissions"**
3. Check **"Allow GitHub Actions to create and approve pull requests"**
4. Click **Save**

### Issue: Workflow succeeds but site still shows 404
**Solution**:
1. Wait 1-2 minutes for GitHub Pages to update
2. Clear your browser cache or try incognito mode
3. Check the actual deployed URL: `https://saifullahsaeed.github.io/drmrtl/` (note the trailing slash)

### Issue: Assets not loading (404 for JS/CSS files)
**Solution**: This means the base path is wrong. Verify:
1. The repository name in `vite.config.js` matches your GitHub repo name (`drmrtl`)
2. The workflow built with `NODE_ENV=production`
3. The built `dist/index.html` has paths starting with `/drmrtl/`

## ✅ Verification Checklist

After deployment, verify:
- [ ] Homepage loads: `https://saifullahsaeed.github.io/drmrtl/`
- [ ] Assets load (no 404s for JS/CSS in browser console)
- [ ] Navigation works (clicking buttons)
- [ ] Report page loads: `https://saifullahsaeed.github.io/drmrtl/report`
- [ ] Direct URL to `/report` works (tests 404.html redirect)

## 📝 Quick Test

Test locally first to make sure everything works:

```bash
npm run build
npm run preview
```

Then visit: `http://localhost:4173/drmrtl/`

If this works locally, the GitHub Pages deployment should work too.
