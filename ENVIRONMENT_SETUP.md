# Environment Setup for MongoDB Backend Connection

## Create `.env.local` file in `portfolio/` folder

Create a file named `.env.local` in your `portfolio/` folder with:

```env
# Backend API URL (Development)
VITE_API_URL=http://localhost:5000/api

# For production deployment, update to your backend URL:
# VITE_API_URL=https://your-backend.onrender.com/api
```

## Why `.env.local`?

- `.env.local` is gitignored by default
- Vite reads `VITE_` prefixed variables automatically
- Different values for development vs production

## Usage in Code

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## Quick Setup

```bash
cd portfolio
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
```

Done! Now your frontend will connect to MongoDB backend.

