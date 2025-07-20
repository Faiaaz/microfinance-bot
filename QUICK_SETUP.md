# 🚀 Quick Setup After BotPenguin Deletion

Since you deleted your bot from BotPenguin, follow these steps to set up your standalone Bengali microfinance bot:

## 📋 Step-by-Step Setup

### 1. Facebook App Setup (5 minutes)

1. **Go to Facebook Developers**: https://developers.facebook.com/apps/
2. **Create New App**:
   - Click "Create App"
   - Select "Business"
   - Name: "Your Microfinance Bot"
   - Contact Email: Your email

3. **Add Messenger**:
   - In left sidebar, click "Add Product"
   - Find "Messenger" and click "Set Up"

4. **Generate Page Access Token**:
   - Go to Messenger → Settings
   - Under "Access Tokens", click "Generate Token"
   - Select your Facebook page
   - **COPY THE TOKEN** (you'll need this)

### 2. Deploy to Render (3 minutes)

1. **Go to Render**: https://render.com
2. **Sign up with GitHub** (if not already)
3. **Create New Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repo: `Faiaaz/microfinance-bot`
   - Name: `microfinance-bot`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variable**:
   - Key: `FB_PAGE_ACCESS_TOKEN`
   - Value: [Paste your Facebook token from step 1]

5. **Deploy** - Click "Create Web Service"

### 3. Configure Facebook Webhook (2 minutes)

1. **Get your Render URL** (e.g., `https://microfinance-bot.onrender.com`)
2. **Go back to Facebook App**:
   - Messenger → Settings → Webhooks
   - Click "Add Callback URL"
   - URL: `https://your-app-name.onrender.com/webhook/`
   - Verify Token: `my_voice_is_my_password_verify_me`
   - Check all subscription fields

### 4. Test Your Bot (1 minute)

1. **Go to your Facebook page**
2. **Click "Message"**
3. **Type "hello"** - you should see the Bengali welcome menu!

## ✅ What You'll Get

Your bot will now have:
- ✅ Bengali welcome message with 3 options
- ✅ Loan submenu with 2 options
- ✅ Savings products information
- ✅ Complaint filing system
- ✅ All responses in Bengali

## 🔧 Customization

Edit `index.js` to customize:
- Loan amounts and rates
- Company information
- Contact details
- Application process

## 🚨 Important Notes

- **Keep your token secure** - never share it publicly
- **Webhook URL must be HTTPS** - Render provides this automatically
- **Test thoroughly** before going live
- **Submit for Facebook review** if you want public access

## 🆘 Need Help?

1. Check the full `SETUP_GUIDE.md` for detailed instructions
2. Check `DEPLOYMENT_GUIDE.md` for alternative deployment options
3. Check your Render logs for any errors

---

**Your Bengali microfinance bot will be live in about 10 minutes!** 🎉 