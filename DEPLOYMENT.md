# 🚀 Firebase Hosting Deployment Guide

## Prerequisites
1. Firebase CLI installed globally
2. Firebase project already initialized
3. Build your project before deploying

## Step-by-Step Deployment

### 1. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase (if not already logged in)
```bash
firebase login
```

### 3. Navigate to your portfolio directory
```bash
cd portfolio
```

### 4. Build your project
```bash
npm run build
```
This creates the `dist` folder with optimized production files.

### 5. Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

### 6. Your live link will be:
After deployment, Firebase will show you a URL like:
- `https://portfolio08-58286.web.app`
- `https://portfolio08-58286.firebaseapp.com`

## Quick Deploy Script

You can also create a deploy script in `package.json`:

```json
"scripts": {
  "deploy": "npm run build && firebase deploy --only hosting"
}
```

Then just run:
```bash
npm run deploy
```

## Updating Your Site

Every time you make changes:
1. Make your changes in the code
2. Run `npm run build`
3. Run `firebase deploy --only hosting`

Or use the quick script:
```bash
npm run deploy
```

## Important Notes

- ✅ Your `firebase.json` is already configured correctly
- ✅ The build output goes to `dist` folder
- ✅ All routes will redirect to `index.html` (for React Router)
- ✅ Your Firebase project ID: `portfolio08-58286`

## Troubleshooting

If you get errors:
1. Make sure you're logged in: `firebase login`
2. Make sure you're in the correct project: `firebase use --add`
3. Make sure you've built the project: `npm run build`
4. Check Firebase console: https://console.firebase.google.com/

