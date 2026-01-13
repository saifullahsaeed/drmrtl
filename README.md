# Daily Report Maker

Daily Sales Report Generator - React Version

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

This project is configured to automatically deploy to GitHub Pages using GitHub Actions when you push to the `main` or `master` branch.

**Setup Steps:**

1. Make sure your repository name matches the base path in `vite.config.js` (default: `DAILY-REPORT-MAKER`)
   - If your repo name is different, update the `VITE_REPO_NAME` in the GitHub Actions workflow or set it as an environment variable

2. Go to your repository Settings → Pages
   - Source: Select "GitHub Actions"
   - Save

3. Push your code to the `main` or `master` branch
   - The GitHub Action will automatically build and deploy your site

4. Your site will be available at: `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`

### Option 2: Manual Deployment

If you prefer to deploy manually:

1. Install `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update the repository name in `vite.config.js` if needed

3. Build and deploy:
   ```bash
   npm run deploy
   ```

### Important Notes

- **Repository Name**: Make sure the base path in `vite.config.js` matches your GitHub repository name
- **Custom Domain**: If you're using a custom domain, set `base: '/'` in `vite.config.js`
- **404.html**: The `404.html` file handles client-side routing for GitHub Pages
- **Base Path**: The app automatically handles the base path for routing

## Configuration

To change the repository name for GitHub Pages, update the `VITE_REPO_NAME` environment variable or modify the default value in `vite.config.js`.

For a custom domain, set the base to `/` in `vite.config.js`:

```js
base: '/'
```
