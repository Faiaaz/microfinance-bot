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
	res.send('Shakti Foundation Bot is running! 🤖💰')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	console.log('Webhook verification request received')
	
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
					
					// Send welcome message with client name
					sendWelcomeMessage(event.sender.id)
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

// Function to get client name from Facebook
function getClientName(senderId, callback) {
	request({
		url: `https://graph.facebook.com/v2.6/${senderId}`,
		qs: { access_token: token, fields: 'first_name' },
		method: 'GET'
	}, function(error, response, body) {
		if (error) {
			console.log('Error getting user info:', error)
			callback('স্যার/ম্যাডাম')
		} else {
			try {
				const userInfo = JSON.parse(body)
				callback(userInfo.first_name || 'স্যার/ম্যাডাম')
			} catch (e) {
				console.log('Error parsing user info:', e)
				callback('স্যার/ম্যাডাম')
			}
		}
	})
}

// Function to send welcome message with client name
function sendWelcomeMessage(sender) {
	getClientName(sender, function(clientName) {
		const welcomeMessage = `শ্রদ্ধেয় ${clientName}! আমি শক্তি, শক্তি ফাউন্ডেশনের পক্ষ থেকে আপনাকে স্বাগতম।`
		sendTextMessage(sender, welcomeMessage)
		
		// Wait a moment then send the buttons
		setTimeout(() => {
						let messageData = {
				"attachment": {
					"type": "template",
					"payload": {
						"template_type": "button",
						"text": "আমি কিভাবে আপনাকে সাহায্য করতে পারি?",
						"buttons": [{
							"type": "postback",
							"title": "ঋণের তথ্য দিন",
							"payload": "LOAN_INFO"
						}, {
							"type": "postback",
							"title": "সঞ্চয়ের তথ্য দিন",
							"payload": "SAVINGS_INFO"
						}, {
							"type": "postback",
							"title": "অভিযোগের জন্য",
							"payload": "COMPLAINT"
						}]
					}
				}
			}
			
			request({
				url: 'https://graph.facebook.com/v2.6/me/messages',
				qs: { access_token: token },
				method: 'POST',
				json: {
					recipient: { id: sender },
					message: messageData
				}
			}, function(error, response, body) {
				if (error) {
					console.log('Error sending buttons:', error)
				} else if (response.body.error) {
					console.log('Error:', response.body.error)
				}
			})
		}, 1000) // Wait 1 second before sending buttons
	})
}

// Function to send text message
function sendTextMessage(sender, text) {
	let messageData = {
		recipient: {
			id: sender
		},
		message: {
			text: text
		}
	}
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: token },
		method: 'POST',
		json: messageData
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending message:', error)
		} else if (response.body.error) {
			console.log('Error:', response.body.error)
		}
	})
}

// Function to send loan information
function sendLoanInfo(sender) {
	sendTextMessage(sender, "💰 আমাদের ঋণ প্রোডাক্টসমূহ:\n\n" +
		"১। জাগরণ লোন – সর্বচ্চ ৫০ হাজার, সার্ভিসচার্জ ১৩%, ১২ মাস মেয়াদ\n\n" +
		"২। অগ্রসর লোন - সর্বচ্চ ৫০ হাজার, সার্ভিসচার্জ ১৩%, ১২ মাস মেয়াদ\n\n" +
		"৩। স্যালারি লোন - সর্বচ্চ ৫০ হাজার, সার্ভিসচার্জ ১৩%, ১২ মাস মেয়াদ\n\n" +
		"৪। রেমিটেন্স লোন - সর্বচ্চ ৫০ হাজার, সার্ভিসচার্জ ১৩%, ১২ মাস মেয়াদ\n\n" +
		"আরও বিস্তারিত জানতে আমাদের নিকটস্থ শাখায় যোগাযোগ করুন।")
}

// Function to send savings information
function sendSavingsInfo(sender) {
	sendTextMessage(sender, "💾 আমাদের সঞ্চয় পণ্যসমূহ:\n\n" +
		"• সঞ্চয় হিসাব: সর্বনিম্ন ১০০ টাকা\n" +
		"• স্থায়ী আমানত: ১,০০০ টাকা থেকে শুরু\n" +
		"• লক্ষ্য সঞ্চয়: বিশেষ উদ্দেশ্যে\n" +
		"• শিশু সঞ্চয়: ভবিষ্যতের জন্য\n\n" +
		"সুদের হার: বছরে ৩-৬%\n" +
		"নিরাপদ এবং নির্ভরযোগ্য\n\n" +
		"আরও জানতে আমাদের শাখায় যোগাযোগ করুন।")
}

// Function to send complaint information
function sendComplaintInfo(sender) {
	sendTextMessage(sender, "📝 অভিযোগ জানানোর পদ্ধতি:\n\n" +
		"আপনার অভিযোগ জানাতে:\n\n" +
		"📞 ফোন: +৮৮ ০৯৬১৩-৪৪৪১১১\n" +
		"📧 ইমেইল: info@shakti.org.bd\n" +
		"🌐 ওয়েবসাইট: www.shakti.org.bd\n\n" +
		"📍 হেড অফিস:\n" +
		"House 04, Road 1, Block A, Section 11\n" +
		"Mirpur, Pallabi, Dhaka 1216\n\n" +
		"আমরা ২৪ ঘণ্টার মধ্যে প্রতিক্রিয়া জানাবো।\n" +
		"ধন্যবাদ আপনার মতামত জানানোর জন্য!")
}

// Function to handle postbacks
function handlePostback(sender, payload) {
	switch(payload) {
		case 'GET_STARTED':
			sendWelcomeMessage(sender)
			break
		case 'LOAN_INFO':
			sendLoanInfo(sender)
			break
		case 'SAVINGS_INFO':
			sendSavingsInfo(sender)
			break
		case 'COMPLAINT':
			sendComplaintInfo(sender)
			break
		default:
			sendTextMessage(sender, 'দুঃখিত, এই অপশনটি এখনও উপলব্ধ নয়।')
	}
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

// Facebook Page Access Token
const token = 'EAAPKDQxpu94BPKD8cvahCt5b1r01WkSaj6WTZBlSJkfbgoxiZBKL7ExPZAZCVLaNdkfy6ZBXn1c4TWZBpJ0ZA3v5RlrPqpoToGIxFoO0PDcihlROoMr2IZC1CXzxGE0MgQGWjmHUyytOcZAWUSexapMaLEzdzgpJyAKlzExv3J9C3KBcwosEqWmvM6i45UqCohOeoP1z4yMd4tgZDZD'
