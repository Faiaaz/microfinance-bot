# 🚀 Microfinance Bot Setup Guide

This guide will walk you through setting up your Facebook Messenger bot for microfinance services.

## 📋 Prerequisites Checklist

- [ ] Node.js installed (v12 or higher)
- [ ] npm or yarn installed
- [ ] Facebook Developer Account
- [ ] Facebook Page (for your microfinance business)
- [ ] Heroku account (for deployment)

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
   - **For production**: Use your Heroku app URL (e.g., `https://your-app.herokuapp.com/webhook/`)
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

```bash
export FB_PAGE_ACCESS_TOKEN=your_actual_page_access_token_here
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
   - Type "hello" or "hi"
   - Type "loan"
   - Type "interest"
   - Type "help"

## 🚀 Step 3: Deploy to Heroku

### 3.1 Install Heroku CLI

Download and install from: https://devcenter.heroku.com/articles/heroku-cli

### 3.2 Login to Heroku

```bash
heroku login
```

### 3.3 Create Heroku App

```bash
heroku create your-microfinance-bot-name
```

### 3.4 Set Environment Variables

```bash
heroku config:set FB_PAGE_ACCESS_TOKEN=your_actual_page_access_token_here
```

### 3.5 Deploy

```bash
git add .
git commit -m "Initial microfinance bot deployment"
git push heroku main
```

### 3.6 Update Facebook Webhook

1. Go back to your Facebook app
2. Update the webhook URL to your Heroku app URL:
   `https://your-app-name.herokuapp.com/webhook/`

## 🎯 Step 4: Customize Your Bot

### 4.1 Update Bot Information

Edit `index.js` to customize:
- Loan amounts and types
- Interest rates
- Application process
- Company information

### 4.2 Update Application URL

In the `sendApplicationInfo()` function, replace `[Your Website URL]` with your actual application website.

### 4.3 Add Your Logo

Replace the image URLs in the message functions with your own images.

## 🔒 Step 5: Security & Best Practices

### 5.1 Environment Variables

Never commit your access token to version control. Always use environment variables:

```javascript
const token = process.env.FB_PAGE_ACCESS_TOKEN
```

### 5.2 HTTPS Only

Ensure your production deployment uses HTTPS (Heroku does this automatically).

### 5.3 Error Handling

The bot includes basic error handling, but consider adding:
- Rate limiting
- Input validation
- Logging

## 📱 Step 6: Test Your Bot

### 6.1 Basic Functionality

Test all commands:
- [ ] Welcome message
- [ ] Loan information
- [ ] Interest rates
- [ ] Application process
- [ ] Help menu
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
- Check verify token matches exactly
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

Add these to your code for debugging:

```javascript
console.log('Received message:', text)
console.log('Sender ID:', sender)
console.log('Webhook payload:', JSON.stringify(req.body, null, 2))
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Facebook Messenger Platform documentation
3. Check your server logs
4. Test webhook manually

---

**Next Steps**: Consider adding features like user authentication, payment processing, and integration with your loan management system. 