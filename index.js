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
	res.send('Microfinance Bot is running! 🤖💰')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text.toLowerCase()
			
			// Handle different user inputs
			if (text === 'hello' || text === 'hi' || text === 'hey') {
				sendWelcomeMessage(sender)
			} else if (text.includes('loan') || text.includes('borrow')) {
				sendLoanInfo(sender)
			} else if (text.includes('interest') || text.includes('rate')) {
				sendInterestInfo(sender)
			} else if (text.includes('apply') || text.includes('application')) {
				sendApplicationInfo(sender)
			} else if (text.includes('help') || text === 'menu') {
				sendHelpMenu(sender)
			} else if (text === 'services') {
				sendServicesMenu(sender)
			} else {
				sendTextMessage(sender, "Thanks for your message! Type 'help' to see what I can assist you with regarding microfinance services.")
			}
		}
		if (event.postback) {
			let payload = event.postback.payload
			handlePostback(sender, payload)
		}
	}
	res.sendStatus(200)
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
