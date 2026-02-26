# Resume Analyzer - Deployment Guide

## Overview
This project is a full-stack application with:
- **Frontend**: React application deployed on Vercel
- **Backend**: Node.js/Express server deployed on Render

---

## 🚀 Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account

### Step 2: Deploy Backend Service
1. Click "New" → "Web Service"
2. Select this GitHub repository
3. Choose the branch: `main`
4. Fill in the following:
   - **Name**: `resume-analyzer-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free tier (or paid if needed)

### Step 3: Configure Environment Variables
In Render dashboard, go to Environment tab and add:
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-vercel-app.vercel.app
OPENAI_API_KEY=your_openai_api_key
```

### Step 4: Deploy
- Click "Create Web Service"
- Render will automatically deploy from GitHub
- Copy your backend URL (e.g., `https://resume-analyzer-backend.onrender.com`)

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up
2. Connect your GitHub account

### Step 2: Deploy Frontend
1. Click "Add New Project"
2. Select this GitHub repository
3. Fill in the following:
   - **Project Name**: `resume-analyzer-client`
   - **Framework Preset**: Vite
   - **Root Directory**: `client/`

### Step 3: Configure Environment Variables
In Vercel project settings:
1. Go to Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://resume-analyzer-backend.onrender.com
   ```
3. Apply to Production environment

### Step 4: Deploy
- Click "Deploy"
- Vercel will automatically build and deploy from GitHub
- Your app will be available at the provided URL

---

## 📱 Local Testing Before Deployment

### Test Backend Locally:
```bash
cd server
npm install
npm start
```
Backend will run on `http://localhost:3001`

### Test Frontend Locally:
```bash
cd client
npm install
VITE_API_URL=http://localhost:3001 npm run dev
```
Frontend will run on `http://localhost:5173`

---

## 🔧 Environment Variables Reference

### Backend (.env)
```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-vercel-app.vercel.app
OPENAI_API_KEY=your_openai_api_key
```

### Frontend (.env.local)
```
VITE_API_URL=https://your-render-backend.onrender.com
```

---

## 📝 Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] Frontend environment variables updated with backend URL
- [ ] Frontend deployed on Vercel
- [ ] API calls working in production
- [ ] CORS properly configured
- [ ] Environment variables set in both services
- [ ] Test key features in production

---

## 🔗 Useful Links
- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **GitHub Integration**: Both platforms auto-deploy on push to main

---

## ⚠️ Common Issues

### CORS Error
- Ensure `FRONTEND_URL` is set in backend environment variables
- Check that the frontend URL is added to allowed origins

### API Not Found
- Verify `VITE_API_URL` is correctly set in frontend environment
- Check backend is running and accessible

### Build Failed
- Ensure all dependencies are listed in package.json
- Check Node version is >= 18

---

## 📞 Support
For issues, check:
1. Platform-specific documentation
2. Application logs in platform dashboard
3. GitHub repository issues
