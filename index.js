'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('Microfinance Bot is running! 🤖💰 - Updated for Railway deployment')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	console.log('Webhook verification request received')
	console.log('Mode:', req.query['hub.mode'])
	console.log('Token:', req.query['hub.verify_token'])
	console.log('Challenge:', req.query['hub.challenge'])
	
	if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		console.log('Webhook verified successfully')
		res.status(200).send(req.query['hub.challenge'])
	} else {
		console.log('Webhook verification failed')
		res.status(403).send('Error, wrong token')
	}
})

// to post data
app.post('/webhook/', function (req, res) {
	console.log('Webhook POST received:', JSON.stringify(req.body, null, 2))
	
	if (req.body.object === 'page') {
		req.body.entry.forEach(function(entry) {
			entry.messaging.forEach(function(event) {
				console.log('Processing message from:', event.sender.id)
				
				if (event.message && event.message.text) {
					let text = event.message.text.toLowerCase()
					console.log('Received text:', text)
					
					// Handle different user inputs
					if (text === 'hello' || text === 'hi' || text === 'hey') {
						sendWelcomeMessage(event.sender.id)
					} else if (text.includes('loan') || text.includes('borrow')) {
						sendLoanInfo(event.sender.id)
					} else if (text.includes('interest') || text.includes('rate')) {
						sendInterestInfo(event.sender.id)
					} else if (text.includes('apply') || text.includes('application')) {
						sendApplicationInfo(event.sender.id)
					} else if (text.includes('help') || text === 'menu') {
						sendHelpMenu(event.sender.id)
					} else if (text === 'services') {
						sendServicesMenu(event.sender.id)
					} else {
						// Suppress fallback message - bot will not respond to unrecognized messages
						console.log('Unrecognized message suppressed:', text)
					}
				}
				
				if (event.postback) {
					console.log('Received postback:', event.postback.payload)
					handlePostback(event.sender.id, event.postback.payload)
				}
			})
		})
		res.status(200).send('EVENT_RECEIVED')
	} else {
		res.sendStatus(404)
	}
})

// Use environment variable for access token (more secure)
const token = process.env.FB_PAGE_ACCESS_TOKEN || "EAAPKDQxpu94BPKD8cvahCt5b1r01WkSaj6WTZBlSJkfbgoxiZBKL7ExPZAZCVLaNdkfy6ZBXn1c4TWZBpJ0ZA3v5RlrPqpoToGIxFoO0PDcihlROoMr2IZC1CXzxGE0MgQGWjmHUyytOcZAWUSexapMaLEzdzgpJyAKlzExv3J9C3KBcwosEqWmvM6i45UqCohOeoP1z4yMd4tgZDZD"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendWelcomeMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "Welcome to Microfinance Bot! 🤖",
					"subtitle": "Your trusted partner for financial services",
					"image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
					"buttons": [{
						"type": "postback",
						"title": "Our Services",
						"payload": "SERVICES"
					}, {
						"type": "postback",
						"title": "Get Help",
						"payload": "HELP"
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendServicesMenu(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "Micro Loans",
					"subtitle": "Small loans for business and personal needs",
					"image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
					"buttons": [{
						"type": "postback",
						"title": "Learn More",
						"payload": "LOAN_INFO"
					}],
				}, {
					"title": "Financial Education",
					"subtitle": "Learn about budgeting, saving, and investing",
					"image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
					"buttons": [{
						"type": "postback",
						"title": "Learn More",
						"payload": "EDUCATION"
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendLoanInfo(sender) {
	sendTextMessage(sender, "💰 Micro Loans Available:\n\n" +
		"• Business Loans: $500 - $5,000\n" +
		"• Personal Loans: $200 - $2,000\n" +
		"• Education Loans: $300 - $3,000\n\n" +
		"Interest rates start at 8% annually.\n" +
		"Repayment terms: 6-24 months\n\n" +
		"Type 'apply' to start your application!")
}

function sendInterestInfo(sender) {
	sendTextMessage(sender, "📊 Our Interest Rates:\n\n" +
		"• Business Loans: 8-12% annually\n" +
		"• Personal Loans: 10-15% annually\n" +
		"• Education Loans: 6-10% annually\n\n" +
		"Rates depend on loan amount, term, and credit history.\n" +
		"No hidden fees or prepayment penalties!")
}

function sendApplicationInfo(sender) {
	sendTextMessage(sender, "📝 Loan Application Process:\n\n" +
		"1. Fill out our online application\n" +
		"2. Submit required documents\n" +
		"3. Credit check and review (1-2 days)\n" +
		"4. Approval and funds transfer\n\n" +
		"Required documents:\n" +
		"• Government ID\n" +
		"• Proof of income\n" +
		"• Bank statements (3 months)\n\n" +
		"Visit our website to apply: [Your Website URL]")
}

function sendHelpMenu(sender) {
	sendTextMessage(sender, "🤖 How can I help you?\n\n" +
		"Try these commands:\n" +
		"• 'loan' - Learn about our loan options\n" +
		"• 'interest' - Check interest rates\n" +
		"• 'apply' - Start loan application\n" +
		"• 'services' - See all our services\n" +
		"• 'help' - Show this menu again")
}

function handlePostback(sender, payload) {
	switch(payload) {
		case 'SERVICES':
			sendServicesMenu(sender)
			break
		case 'HELP':
			sendHelpMenu(sender)
			break
		case 'LOAN_INFO':
			sendLoanInfo(sender)
			break
		case 'EDUCATION':
			sendTextMessage(sender, "📚 Financial Education Resources:\n\n" +
				"• Budgeting basics\n" +
				"• Saving strategies\n" +
				"• Credit building tips\n" +
				"• Investment fundamentals\n\n" +
				"Check out our blog for detailed articles!")
			break
		default:
			sendTextMessage(sender, "I'm here to help with your microfinance needs. Type 'help' to see what I can do!")
	}
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('Microfinance Bot running on port', app.get('port'))
})
