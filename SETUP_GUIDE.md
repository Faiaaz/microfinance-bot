# 🚀 Microfinance Bot Setup Guide (Updated for Bengali Bot)

This guide will walk you through setting up your Facebook Messenger bot for microfinance services with Bengali language support.

## 📋 Prerequisites Checklist

- [ ] Node.js installed (v12 or higher)
- [ ] npm or yarn installed
- [ ] Facebook Developer Account
- [ ] Facebook Page (for your microfinance business)
- [ ] Render/Railway account (for free deployment)

## 🔧 Step 1: Facebook App Setup

### 1.1 Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Click "Create App"
3. Select "Business" as the app type
4. Fill in your app details:
   - **App Name**: "Your Microfinance Bot" (or your business name)
   - **Contact Email**: Your email address
   - **Business Account**: Select your business account (optional)

### 1.2 Configure Messenger

1. In your app dashboard, find "Messenger" in the left sidebar
2. Click "Messenger" → "Settings"
3. Under "Access Tokens", click "Generate Token"
4. Select your Facebook page
5. **Save the Page Access Token** - you'll need this later!

### 1.3 Set Up Webhook

1. In the Messenger settings, scroll down to "Webhooks"
2. Click "Add Callback URL"
3. Enter your webhook URL:
   - **For local testing**: Use ngrok URL (e.g., `https://abc123.ngrok.io/webhook/`)
   - **For production**: Use your Render app URL (e.g., `https://your-app.onrender.com/webhook/`)
4. **Verify Token**: Enter `my_voice_is_my_password_verify_me`
5. **Subscription Fields**: Check all available fields:
   - `messages`
   - `messaging_postbacks`
   - `messaging_optins`
   - `message_deliveries`
   - `message_reads`

## 🔧 Step 2: Local Development Setup

### 2.1 Install Dependencies

```bash
npm install
```

### 2.2 Set Environment Variables

Create a `.env` file in your project root:

```bash
FB_PAGE_ACCESS_TOKEN=your_actual_page_access_token_here
```

### 2.3 Test Locally with ngrok

1. Install ngrok globally:
   ```bash
   npm install -g ngrok
   ```

2. Start your bot:
   ```bash
   npm start
   ```

3. In another terminal, start ngrok:
   ```bash
   ngrok http 5000
   ```

4. Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`)

5. Update your Facebook webhook URL to: `https://abc123.ngrok.io/webhook/`

### 2.4 Test Your Bot

1. Go to your Facebook page
2. Click "Message"
3. Try these commands:
   - Type "hello" or "hi" (should show Bengali welcome menu)
   - Click on "লোন সম্পর্কে জানতে চাই" (should show loan submenu)
   - Click on "সেভিংস প্রোডাক্টস সম্পর্কে জানতে চাই"
   - Click on "অভিযোগ জানাতে চাই"

## 🚀 Step 3: Deploy to Render (Recommended)

### 3.1 Deploy to Render

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `microfinance-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variable:
   - Key: `FB_PAGE_ACCESS_TOKEN`
   - Value: Your Facebook Page Access Token
7. Deploy!

### 3.2 Update Facebook Webhook

After deployment, update your Facebook app webhook URL to:
`https://your-app-name.onrender.com/webhook/`

## 🎯 Step 4: Bot Features

### 4.1 Bengali Welcome Menu

The bot now shows a Bengali welcome message with three options:
- **লোন সম্পর্কে জানতে চাই** (I want to know about loans)
- **সেভিংস প্রোডাক্টস সম্পর্কে জানতে চাই** (I want to know about savings products)
- **অভিযোগ জানাতে চাই** (I want to file a complaint)

### 4.2 Loan Submenu

When users click on loans, they see:
- **আমি লোন সম্পর্কিত তথ্য চাই** (I want information about loans)
- **আমি লোন নিতে চাই** (I want to take a loan)

### 4.3 Customize Content

Edit `index.js` to customize:
- Loan amounts and types
- Interest rates
- Application process
- Company information
- Contact details

## 🔒 Step 5: Security & Best Practices

### 5.1 Environment Variables

Never commit your access token to version control. Always use environment variables:

```javascript
const token = process.env.FB_PAGE_ACCESS_TOKEN
```

### 5.2 HTTPS Only

Ensure your production deployment uses HTTPS (Render does this automatically).

### 5.3 Error Handling

The bot includes basic error handling, but consider adding:
- Rate limiting
- Input validation
- Logging

## 📱 Step 6: Test Your Bot

### 6.1 Basic Functionality

Test all Bengali features:
- [ ] Bengali welcome message
- [ ] Loan information in Bengali
- [ ] Savings products in Bengali
- [ ] Complaint filing in Bengali
- [ ] Loan submenu options
- [ ] Interactive buttons

### 6.2 Error Scenarios

Test what happens when:
- [ ] User sends invalid input
- [ ] Network issues occur
- [ ] Facebook API is down

## 🎉 Step 7: Go Live

### 7.1 Facebook App Review

For public use, submit your app for Facebook review:
1. Go to your app dashboard
2. Click "App Review"
3. Submit for review

### 7.2 Share Your Bot

- Add a chat button to your website
- Use the shortlink: `https://m.me/your-page-username`
- Share on social media

## 🛠️ Troubleshooting

### Common Issues

**Webhook verification fails:**
- Check verify token matches exactly: `my_voice_is_my_password_verify_me`
- Ensure webhook URL is accessible
- Verify HTTPS is used

**Messages not sending:**
- Verify Page Access Token is correct
- Check bot has permission to send messages
- Ensure subscription fields are enabled

**Bot not responding:**
- Check server logs for errors
- Verify webhook is properly configured
- Test webhook URL manually

### Debug Commands

The bot includes debug logging. Check your server logs for:
- Webhook verification requests
- Message processing
- Error messages

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Facebook Messenger Platform documentation
3. Check your server logs
4. Test webhook manually

---

**Next Steps**: Consider adding features like user authentication, payment processing, and integration with your loan management system. 