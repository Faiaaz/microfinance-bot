# 🤖 Microfinance Bot - Facebook Messenger Bot

A Facebook Messenger bot designed to provide microfinance services, loan information, and financial education to users through an intuitive chat interface.

## ✨ Features

- **Welcome Messages**: Greets users with a professional welcome card
- **Loan Information**: Provides details about different loan types and amounts
- **Interest Rate Information**: Shows current interest rates for various loan products
- **Application Process**: Guides users through the loan application process
- **Financial Education**: Offers resources for financial literacy
- **Interactive Menus**: Rich media cards with buttons for easy navigation
- **Help System**: Comprehensive help menu with available commands

## 🚀 Quick Start

### Prerequisites

- Node.js (v12 or higher)
- npm or yarn
- Facebook Developer Account
- Facebook Page
- Heroku account (for deployment)

### Local Development Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   export FB_PAGE_ACCESS_TOKEN=your_facebook_page_access_token
   ```

3. **Run the bot locally:**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

4. **Test locally using ngrok:**
   ```bash
   # Install ngrok if you haven't already
   npm install -g ngrok
   
   # Start ngrok to expose your local server
   ngrok http 5000
   ```

## 🔧 Facebook App Setup

### 1. Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Click "Create App" and select "Business" type
3. Fill in your app details

### 2. Configure Messenger

1. In your app dashboard, go to "Messenger" → "Settings"
2. Generate a Page Access Token for your Facebook page
3. Set up webhook with:
   - **Webhook URL**: `https://your-domain.com/webhook/`
   - **Verify Token**: `my_voice_is_my_password_verify_me`
   - **Subscription Fields**: Check all available fields

### 3. Update the Bot Code

Replace `<FB_PAGE_ACCESS_TOKEN>` in `index.js` with your actual Page Access Token:

```javascript
const token = "your_actual_page_access_token_here"
```

Or use environment variables (recommended):

```javascript
const token = process.env.FB_PAGE_ACCESS_TOKEN
```

## 🚀 Deployment to Heroku

1. **Install Heroku CLI and login:**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app:**
   ```bash
   heroku create your-microfinance-bot
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set FB_PAGE_ACCESS_TOKEN=your_facebook_page_access_token
   ```

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Initial microfinance bot deployment"
   git push heroku main
   ```

5. **Update your Facebook webhook URL** to point to your Heroku app URL.

## 💬 Bot Commands

Users can interact with the bot using these commands:

- `hello`, `hi`, `hey` - Get welcome message
- `loan` - Learn about loan options
- `interest` - Check interest rates
- `apply` - Start loan application process
- `services` - View all available services
- `help` - Show help menu

## 🎯 Customization

### Adding New Commands

To add new commands, update the message handling logic in `index.js`:

```javascript
if (text.includes('your_keyword')) {
    sendYourCustomMessage(sender)
}
```

### Customizing Messages

Edit the message content in the respective functions:
- `sendLoanInfo()` - Loan information
- `sendInterestInfo()` - Interest rates
- `sendApplicationInfo()` - Application process
- `sendHelpMenu()` - Help menu

### Adding New Features

1. Create new message functions
2. Add command handling in the main webhook
3. Update the help menu to include new commands

## 🔒 Security Best Practices

- Use environment variables for sensitive tokens
- Never commit access tokens to version control
- Use HTTPS for production deployments
- Implement rate limiting for production use
- Add input validation and sanitization

## 📱 Testing Your Bot

1. Go to your Facebook page
2. Click "Message" to start a conversation
3. Try the different commands to test functionality
4. Test the interactive buttons and postback responses

## 🛠️ Troubleshooting

### Common Issues

1. **Webhook verification fails:**
   - Ensure verify token matches exactly
   - Check webhook URL is accessible

2. **Messages not sending:**
   - Verify Page Access Token is correct
   - Check bot has permission to send messages

3. **Bot not responding:**
   - Ensure webhook is properly configured
   - Check server logs for errors
   - Verify subscription fields are enabled

### Debug Mode

Enable debug logging by adding console.log statements:

```javascript
console.log('Received message:', text)
console.log('Sender ID:', sender)
```

## 📈 Next Steps

- [ ] Add user authentication
- [ ] Integrate with loan management system
- [ ] Add payment processing
- [ ] Implement user profiles
- [ ] Add analytics and reporting
- [ ] Integrate with CRM system
- [ ] Add multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review Facebook Messenger Platform documentation
- Open an issue on GitHub

---

**Note**: Remember to comply with Facebook's Platform Policies and ensure your bot follows all guidelines for business messaging.
