# 🚀 Quick Deploy to Firebase Hosting

## Your Live URLs Will Be:
- **Primary:** `https://portfolio08-58286.web.app`
- **Alternative:** `https://portfolio08-58286.firebaseapp.com`

## Option 1: Fix Firebase CLI and Deploy

### Step 1: Reinstall Firebase CLI
```bash
npm uninstall -g firebase-tools
npm install -g firebase-tools
```

### Step 2: Deploy
```bash
npm run deploy
```

## Option 2: Use npx (No Installation Needed)

### Step 1: Build your project
```bash
npm run build
```

### Step 2: Deploy using npx
```bash
npx firebase-tools deploy --only hosting
```
(When prompted, type `y` and press Enter)

## Option 3: Manual Deployment via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **portfolio08-58286**
3. Click on **Hosting** in the left menu
4. Click **Get Started** (if first time)
5. Click **Add files** or drag and drop your `dist` folder contents
6. Your site will be live at the URLs above

## After Deployment

✅ Your portfolio will be live at:
- `https://portfolio08-58286.web.app`
- `https://portfolio08-58286.firebaseapp.com`

✅ Share this link with anyone - they'll see your latest updates!

✅ When you update data in admin panel, it will be visible to everyone with the live link!

## Updating Your Site

Every time you make changes:
1. Make your changes
2. Run: `npm run build`
3. Run: `npx firebase-tools deploy --only hosting` (or `npm run deploy` if CLI is fixed)

## Current Status

✅ Project built successfully
✅ Firebase project connected: **portfolio08-58286**
✅ Build output ready in `dist` folder
⚠️ Firebase CLI needs reinstall (use Option 2 with npx for now)

