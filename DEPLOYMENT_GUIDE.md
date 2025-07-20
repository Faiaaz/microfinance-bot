# 🚀 Free Deployment Options for Your Microfinance Bot

Here are several free alternatives to Heroku for deploying your Facebook Messenger bot:

## 🚂 Railway (Recommended)

**Free Tier**: $5 credit monthly (more than enough for a bot)

### Quick Setup:
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Connect your GitHub repository
5. Add environment variable:
   - Name: `FB_PAGE_ACCESS_TOKEN`
   - Value: `EAAPKDQxpu94BPKD8cvahCt5b1r01WkSaj6WTZBlSJkfbgoxiZBKL7ExPZAZCVLaNdkfy6ZBXn1c4TWZBpJ0ZA3v5RlrPqpoToGIxFoO0PDcihlROoMr2IZC1CXzxGE0MgQGWjmHUyytOcZAWUSexapMaLEzdzgpJyAKlzExv3J9C3KBcwosEqWmvM6i45UqCohOeoP1z4yMd4tgZDZD`
6. Deploy automatically!

**Pros**: Very easy, automatic HTTPS, great performance

---

## 🎨 Render

**Free Tier**: Available with some limitations

### Setup:
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: `microfinance-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variable:
   - Key: `FB_PAGE_ACCESS_TOKEN`
   - Value: Your token
7. Deploy!

**Pros**: Reliable, good documentation, automatic HTTPS

---

## ⚡ Vercel

**Free Tier**: Generous limits

### Setup:
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Configure:
   - **Framework Preset**: `Node.js`
   - **Build Command**: `npm install`
   - **Output Directory**: `.`
   - **Install Command**: `npm install`
5. Add environment variable in dashboard
6. Deploy!

**Pros**: Excellent performance, great developer experience

---

## 🎯 Glitch (Simplest)

**Free Tier**: Completely free

### Setup:
1. Go to [Glitch.com](https://glitch.com)
2. Click "New Project" → "Import from GitHub"
3. Paste your GitHub repo URL
4. Add environment variable in `.env` file:
   ```
   FB_PAGE_ACCESS_TOKEN=your_token_here
   ```
5. Done! Your bot is live

**Pros**: Instant deployment, no configuration needed

---

## 🐳 Netlify Functions

**Free Tier**: 125,000 requests/month

### Setup:
1. Go to [Netlify.com](https://netlify.com)
2. Sign up and connect GitHub
3. Create new site from Git
4. Configure build settings:
   - **Build command**: `npm install`
   - **Publish directory**: `public` (create empty folder)
5. Add environment variable in site settings
6. Deploy!

**Pros**: Great for serverless functions, reliable

---

## 🔧 Environment Variables Setup

For all platforms, make sure to set this environment variable:

```
FB_PAGE_ACCESS_TOKEN=EAAPKDQxpu94BPKD8cvahCt5b1r01WkSaj6WTZBlSJkfbgoxiZBKL7ExPZAZCVLaNdkfy6ZBXn1c4TWZBpJ0ZA3v5RlrPqpoToGIxFoO0PDcihlROoMr2IZC1CXzxGE0MgQGWjmHUyytOcZAWUSexapMaLEzdzgpJyAKlzExv3J9C3KBcwosEqWmvM6i45UqCohOeoP1z4yMd4tgZDZD
```

## 📝 Update Facebook Webhook

After deployment, update your Facebook app webhook URL to your new domain:

- **Railway**: `https://your-app-name.railway.app/webhook/`
- **Render**: `https://your-app-name.onrender.com/webhook/`
- **Vercel**: `https://your-app-name.vercel.app/webhook/`
- **Glitch**: `https://your-app-name.glitch.me/webhook/`
- **Netlify**: `https://your-app-name.netlify.app/.netlify/functions/webhook/`

## 🎯 My Recommendation

**Start with Railway** - it's the easiest and most reliable free option. If you need more features later, you can easily migrate to other platforms.

## 🚀 Quick Deploy Commands

### Railway (CLI):
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Render (CLI):
```bash
npm install -g render-cli
render login
render deploy
```

---

**Choose any of these options and your bot will be live for free!** 🎉 