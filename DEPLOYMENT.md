# Deploy to Render.com - Get Your Live Link!

## 🚀 Steps to Deploy (5 minutes):

### Step 1: Create Render Account
1. Go to: **https://render.com**
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest) or email

### Step 2: Create New Web Service
1. After login, click **"New +"** button (top right)
2. Select **"Web Service"**

### Step 3: Connect Your Code

**Option A: Upload from Computer (Easiest)**
1. Click **"Public Git repository"**
2. You'll need to upload your code to GitHub first (see below)

**Option B: Direct Upload**
1. Zip your project folder
2. Upload to GitHub
3. Connect GitHub to Render

### Step 4: Configure Service

Fill in these details:
- **Name:** `thinkers-academy` (or any name you want)
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Select **FREE**

### Step 5: Add Environment Variables

Click **"Advanced"** and add:
- `TEST_MODE` = `true`
- `SESSION_SECRET` = `your-secret-key-123`

### Step 6: Deploy!

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. You'll get your link: **https://thinkers-academy.onrender.com**

---

## 📤 Quick GitHub Upload (If Needed):

### Option 1: Use GitHub Desktop
1. Download: https://desktop.github.com
2. Create new repository
3. Add your files
4. Publish to GitHub

### Option 2: Use Git Command Line
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/thinkers-academy.git
git push -u origin main
```

---

## ✅ After Deployment:

Your website will be live at:
**https://YOUR-APP-NAME.onrender.com**

Example: `https://thinkers-academy.onrender.com`

This link:
- ✅ Works forever (as long as account is active)
- ✅ No password page
- ✅ Free SSL certificate (https)
- ✅ Can share with anyone
- ✅ Professional link

---

## 🆘 Need Help?

If you get stuck, tell me which step and I'll guide you!
