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
					
					// Send welcome message if this is the first interaction
					sendWelcomeIfNeeded(event.sender.id)
					
					// Handle different user inputs
					if (text === 'hello' || text === 'hi' || text === 'hey' || text === 'start' || text === 'begin') {
						// Welcome already sent above, no need to send again
					} else if (text === '1' || text === '১') {
						sendLoanInfoBengali(event.sender.id)
					} else if (text === 'e' || text === 'E' || text === 'ই') {
						sendELoanInfo(event.sender.id)
					} else if (text === 'w' || text === 'W' || text === 'ও') {
						sendWashLoanInfo(event.sender.id)
					} else if (text === 'j' || text === 'J' || text === 'জ') {
						sendJagranLoanInfo(event.sender.id)
					} else if (text === '2' || text === '২') {
						sendSavingsInfoBengali(event.sender.id)
					} else if (text === '3' || text === '৩') {
						sendComplaintInfoBengali(event.sender.id)
					} else if (text === '4' || text === '৪') {
						sendTextMessage(event.sender.id, "🔍 আপনার এলাকার শাখা খুঁজতে এলাকার নাম লিখুন:\n\nউদাহরণ:\n• মিরপুর\n• যাত্রাবাড়ী\n• কেরানীগঞ্জ\n• লালবাগ\n• ভাটারা\n\nঅথবা জেলার নাম লিখুন (যেমন: ঢাকা, চট্টগ্রাম)")
					} else if (text === '5' || text === '৫') {
						sendSalaryLoanInfo(event.sender.id)
					} else if (text === '6' || text === '৬') {
						sendRemittanceLoanInfo(event.sender.id)
					} else if (text === '7' || text === '৭') {
						sendSMELoanInfo(event.sender.id)
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
					} else if (text.includes('location') || text.includes('address') || text.includes('branch') || text.includes('শাখা') || text.includes('এলাকা')) {
						// Extract location from the message
						let location = text.replace(/location|address|branch|শাখা|এলাকা|খুঁজুন|খুঁজছি/gi, '').trim()
						if (location) {
							handleLocationSearch(event.sender.id, location)
						} else {
							sendTextMessage(event.sender.id, "🔍 কোন এলাকার শাখা খুঁজছেন? এলাকার নাম লিখুন।")
						}
					} else {
						// Check if the text might be a location search
						const possibleLocations = ['মিরপুর', 'যাত্রাবাড়ী', 'কেরানীগঞ্জ', 'লালবাগ', 'ভাটারা', 'পল্লবী', 'খিলক্ষেত', 'ঢাকা', 'mirpur', 'jatrabari', 'keraniganj', 'lalbag', 'vatara', 'pallabi', 'khilkhet', 'dhaka']
						const isLocation = possibleLocations.some(loc => text.toLowerCase().includes(loc.toLowerCase()))
						
						if (isLocation) {
							handleLocationSearch(event.sender.id, text)
						} else {
							// Send welcome message for unrecognized input
							sendWelcomeMessage(event.sender.id)
						}
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

// Set up Greeting Text (shows immediately when user clicks Send Message)
function setupGreetingText() {
	request({
		url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
		qs: {access_token:token},
		method: 'POST',
		json: {
			greeting: [{
				locale: "default",
				text: "শক্তি ফাউন্ডেশনের অফিসিয়াল পেইজে আপনাকে স্বাগতম। আপনার কী জানতে ইচ্ছা?"
			}]
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error setting up Greeting Text: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		} else {
			console.log('Greeting Text set up successfully!')
		}
	})
}

// Set up Persistent Menu (buttons that stay at bottom)
function setupPersistentMenu() {
	request({
		url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
		qs: {access_token:token},
		method: 'POST',
		json: {
			persistent_menu: [{
				locale: "default",
				composer_input_disabled: false,
				call_to_actions: [{
					title: "লোন সম্পর্কে জানতে চাই",
					type: "postback",
					payload: "LOAN_INFO_BENGALI"
				}, {
					title: "সেভিংস সম্পর্কে জানতে চাই",
					type: "postback",
					payload: "SAVINGS_INFO_BENGALI"
				}, {
					title: "অভিযোগ জানাতে চাই",
					type: "postback",
					payload: "COMPLAINT_BENGALI"
				}]
			}]
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error setting up Persistent Menu: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		} else {
			console.log('Persistent Menu set up successfully!')
		}
	})
}

// Track if user has received welcome message
let welcomeSent = new Set()

// Function to send welcome message if not already sent
function sendWelcomeIfNeeded(sender) {
	if (!welcomeSent.has(sender)) {
		welcomeSent.add(sender)
		sendWelcomeMessage(sender)
	}
}

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
	// First send the welcome message with full options as text
	sendTextMessage(sender, "শক্তি ফাউন্ডেশনের অফিসিয়াল পেইজে আপনাকে স্বাগতম।\n\nআপনার কী জানতে ইচ্ছা?\n\n১. লোন সম্পর্কে জানতে চাই\n২. সেভিংস প্রোডাক্টস সম্পর্কে জানতে চাই\n৩. অভিযোগ জানাতে চাই\n৪. শাখা খুঁজুন\n\nউপরে উল্লিখিত নম্বর লিখুন অথবা নিচের বোতাম ব্যবহার করুন।")
	
	// Wait a moment then send the buttons
	setTimeout(() => {
		let messageData = {
			"attachment": {
				"type": "template",
				"payload": {
					"template_type": "button",
					"text": "দ্রুত অপশন:",
					"buttons": [{
						"type": "postback",
						"title": "লোন সম্পর্কে জানতে চাই",
						"payload": "LOAN_INFO_BENGALI"
					}, {
						"type": "postback",
						"title": "সেভিংস সম্পর্কে জানতে চাই",
						"payload": "SAVINGS_INFO_BENGALI"
					}, {
						"type": "postback",
						"title": "শাখা খুঁজুন",
						"payload": "BRANCH_SEARCH"
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
	}, 1000) // Wait 1 second before sending buttons
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

function sendLoanInfoBengali(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "button",
				"text": "আমাদের লোন প্রোডাক্ট সম্পর্কে জানতে বা আবেদন করতে চাইলে নিচের যেকোনো অপশন বেছে নিন:",
				"buttons": [{
					"type": "postback",
					"title": "আমি লোন সম্পর্কিত তথ্য চাই",
					"payload": "LOAN_DETAILS_BENGALI"
				}, {
					"type": "postback",
					"title": "আমি লোন নিতে চাই",
					"payload": "LOAN_APPLY_BENGALI"
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

function sendSavingsInfoBengali(sender) {
	sendTextMessage(sender, "💾 আমাদের সঞ্চয় পণ্যসমূহ:\n\n" +
		"• সঞ্চয় হিসাব: সর্বনিম্ন $১০\n" +
		"• স্থায়ী আমানত: $১০০ থেকে শুরু\n" +
		"• লক্ষ্য সঞ্চয়: বিশেষ উদ্দেশ্যে\n\n" +
		"সুদের হার: বছরে ৩-৫%\n" +
		"নিরাপদ এবং নির্ভরযোগ্য\n\n" +
		"আরও জানতে 'help' লিখুন!")
}

function sendComplaintInfoBengali(sender) {
	sendTextMessage(sender, "📝 অভিযোগ জানানোর পদ্ধতি:\n\n" +
		"আপনার অভিযোগ জানাতে:\n" +
		"• ইমেইল: support@microfinance.com\n" +
		"• ফোন: +১-৮০০-১২৩-৪৫৬৭\n" +
		"• ওয়েবসাইট: www.microfinance.com/complaints\n\n" +
		"আমরা ২৪ ঘণ্টার মধ্যে প্রতিক্রিয়া জানাবো।\n" +
		"ধন্যবাদ আপনার মতামত জানানোর জন্য!")
}

function sendLoanDetailsBengali(sender) {
	// Send only the loan products as text
	sendTextMessage(sender, "আমাদের লোন প্রোডাক্টসমূহ:\n\n" +
		"১. 💻 ই-লোন (ই-কমার্স, অনলাইন ব্যবসা)\n" +
		"২. 🚰 ওয়াশ লোন (স্যানিটেশন, স্বাস্থ্য)\n" +
		"৩. 🌅 জাগরণ লোন (ক্ষুদ্র ব্যবসা শুরু)\n" +
		"৪. 📈 অগ্রসর লোন (ব্যবসা সম্প্রসারণ)\n" +
		"৫. 💰 স্যালারি লোন (চাকরিজীবীদের জন্য)\n" +
		"৬. 🌍 রেমিটেন্স লোন (প্রবাসীদের পরিবার)\n" +
		"৭. 🏢 এসএমই লোন (ক্ষুদ্র ও মাঝারি উদ্যোগ)\n\n" +
		"উপরে উল্লিখিত নম্বর লিখুন।")
}

function sendLoanApplyBengali(sender) {
	sendTextMessage(sender, "আমাদের লোন সম্পর্কিত বিস্তারিত জানতে অনুগ্রহ করে আপনার লোকেশন এবং আপনার যোগাযোগের নাম্বার দিন।\n\nআপনার নিকটস্থ যে কোন ব্রাঞ্চের সাথে যোগাযোগ করুন।\n\n🔍 আপনার এলাকার শাখা খুঁজতে এলাকার নাম লিখুন (যেমন: মিরপুর, যাত্রাবাড়ী, কেরানীগঞ্জ)")
}

function sendELoanInfo(sender) {
	sendTextMessage(sender, "💻 ই-লোন:\n\n" +
		"• সর্বোচ্চ ঋণ: ৫০,০০০ টাকা\n" +
		"• সুদের হার: বছরে ১২%\n" +
		"• মেয়াদ: ১২-৩৬ মাস\n" +
		"• উদ্দেশ্য: ই-কমার্স, অনলাইন ব্যবসা\n\n" +
		"আবেদনের জন্য: www.shoktifoundation.com/e-loan")
}

function sendWashLoanInfo(sender) {
	sendTextMessage(sender, "🚰 ওয়াশ লোন:\n\n" +
		"• সর্বোচ্চ ঋণ: ৩০,০০০ টাকা\n" +
		"• সুদের হার: বছরে ১০%\n" +
		"• মেয়াদ: ১২-২৪ মাস\n" +
		"• উদ্দেশ্য: স্যানিটেশন, স্বাস্থ্য\n\n" +
		"আবেদনের জন্য: www.shoktifoundation.com/wash-loan")
}

function sendJagranLoanInfo(sender) {
	sendTextMessage(sender, "🌅 জাগরণ লোন:\n\n" +
		"• সর্বোচ্চ ঋণ: ২৫,০০০ টাকা\n" +
		"• সুদের হার: বছরে ৯%\n" +
		"• মেয়াদ: ১২-১৮ মাস\n" +
		"• উদ্দেশ্য: ক্ষুদ্র ব্যবসা শুরু\n\n" +
		"আবেদনের জন্য: www.shoktifoundation.com/jagran-loan")
}

function sendAgrasarLoanInfo(sender) {
	sendTextMessage(sender, "📈 অগ্রসর লোন:\n\n" +
		"• সর্বোচ্চ ঋণ: ১,০০,০০০ টাকা\n" +
		"• সুদের হার: বছরে ১১%\n" +
		"• মেয়াদ: ১২-৪৮ মাস\n" +
		"• উদ্দেশ্য: ব্যবসা সম্প্রসারণ\n\n" +
		"আবেদনের জন্য: www.shoktifoundation.com/agrasar-loan")
}

function sendSalaryLoanInfo(sender) {
	sendTextMessage(sender, "💰 স্যালারি লোন:\n\n" +
		"• সর্বোচ্চ ঋণ: ৫,০০,০০০ টাকা\n" +
		"• সুদের হার: বছরে ৮%\n" +
		"• মেয়াদ: ১২-৬০ মাস\n" +
		"• উদ্দেশ্য: চাকরিজীবীদের জন্য\n\n" +
		"আবেদনের জন্য: www.shoktifoundation.com/salary-loan")
}

function sendRemittanceLoanInfo(sender) {
	sendTextMessage(sender, "🌍 রেমিটেন্স লোন:\n\n" +
		"• সর্বোচ্চ ঋণ: ২,০০,০০০ টাকা\n" +
		"• সুদের হার: বছরে ১০%\n" +
		"• মেয়াদ: ১২-৩৬ মাস\n" +
		"• উদ্দেশ্য: প্রবাসীদের পরিবার\n\n" +
		"আবেদনের জন্য: www.shoktifoundation.com/remittance-loan")
}

function sendSMELoanInfo(sender) {
	sendTextMessage(sender, "🏢 এসএমই লোন:\n\n" +
		"• সর্বোচ্চ ঋণ: ১০,০০,০০০ টাকা\n" +
		"• সুদের হার: বছরে ১২%\n" +
		"• মেয়াদ: ১২-৭২ মাস\n" +
		"• উদ্দেশ্য: ক্ষুদ্র ও মাঝারি উদ্যোগ\n\n" +
		"আবেদনের জন্য: www.shoktifoundation.com/sme-loan")
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
		case 'GET_STARTED':
			sendWelcomeMessage(sender)
			break
		case 'SERVICES':
			sendServicesMenu(sender)
			break
		case 'HELP':
			sendHelpMenu(sender)
			break
		case 'LOAN_INFO':
			sendLoanInfo(sender)
			break
		case 'LOAN_INFO_BENGALI':
			sendLoanInfoBengali(sender)
			break
		case 'SAVINGS_INFO_BENGALI':
			sendSavingsInfoBengali(sender)
			break
		case 'COMPLAINT_BENGALI':
			sendComplaintInfoBengali(sender)
			break
		case 'BRANCH_SEARCH':
			sendTextMessage(sender, "🔍 আপনার এলাকার শাখা খুঁজতে এলাকার নাম লিখুন:\n\nউদাহরণ:\n• মিরপুর\n• যাত্রাবাড়ী\n• কেরানীগঞ্জ\n• লালবাগ\n• ভাটারা\n\nঅথবা জেলার নাম লিখুন (যেমন: ঢাকা, চট্টগ্রাম)")
			break
		case 'LOAN_DETAILS_BENGALI':
			sendLoanDetailsBengali(sender)
			break
		case 'LOAN_APPLY_BENGALI':
			sendLoanApplyBengali(sender)
			break
		case 'E_LOAN_INFO':
			sendELoanInfo(sender)
			break
		case 'WASH_LOAN_INFO':
			sendWashLoanInfo(sender)
			break
		case 'JAGRAN_LOAN_INFO':
			sendJagranLoanInfo(sender)
			break
		case 'AGRASAR_LOAN_INFO':
			sendAgrasarLoanInfo(sender)
			break
		case 'SALARY_LOAN_INFO':
			sendSalaryLoanInfo(sender)
			break
		case 'REMITTANCE_LOAN_INFO':
			sendRemittanceLoanInfo(sender)
			break
		case 'SME_LOAN_INFO':
			sendSMELoanInfo(sender)
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

// Shakti Foundation branch data (from https://www.shakti.org.bd/coverage)
const shaktiBranches = [
	{
		code: "0001",
		name: "Mirpur 10 Dhaka",
		phone: "001847099001",
		address: "বাড়ির মালিকঃকাজি আফুরউদ্দিন আহমদ, ১৯/৩,বড়বাগ মিরপুর, ঢাকা",
		district: "Dhaka",
		thana: "Pallabi",
		lat: 23.801501,
		long: 90.361314,
		category: "MFP"
	},
	{
		code: "0002", 
		name: "Nawbgonj-Section Dhaka",
		phone: "001847099002",
		address: "মোঃ সফিকুর রহমান, ৪৯-৫১ নবাবগঞ্জ রোড,জনতা বাংকের উপরে (৩য় তলা) নবাবগঞ্জ-সেকশন, লালবাগ, ঢাকা",
		district: "Dhaka",
		thana: "Lalbag",
		lat: 23.7240015,
		long: 90.3761593,
		category: "MFP"
	},
	{
		code: "0003",
		name: "Jatrabari Dhaka", 
		phone: "001847099003",
		address: "মোঃ আলহাজ্ব নুরুদ্দিন সরদার, ৮নং সহিদ ফারুক রোড, যাত্রাবাড়ী, ঢাকা",
		district: "Dhaka",
		thana: "Jatrabari",
		lat: 23.70933,
		long: 90.428389,
		category: "MFP"
	},
	{
		code: "0004",
		name: "Mirpur-Stadium Dhaka",
		phone: "001847099004", 
		address: "মোঃ হারুনার রশিদ, পিতাঃ মরহুম হাসান আলী ,বাড়ী নং-১৮, রোড নং-০১, ব্লক- বি ,সেকশন -৬,মিরপুর- ঢাকা,১২১৬",
		district: "Dhaka",
		thana: "Pallabi",
		lat: 23.809203,
		long: 90.3634943,
		category: "MFP"
	},
	{
		code: "0005",
		name: "Vatara Dhaka",
		phone: "001847099005",
		address: "মো: মাহবুবুল আলম পিতা : আব্দুস সাত্তার মজুমদার, (২য় তলা), বাড়ী নং-০২, ডা: শাফি স্বরনী রোড, ভাটারা নতুন বাজার, ঢাকা-১২১২",
		district: "Dhaka", 
		thana: "Khilkhet",
		lat: 23.798630,
		long: 90.428727,
		category: "MFP"
	},
	{
		code: "0006",
		name: "Matborbazar-Kamrangirchar Dhaka",
		phone: "001847099006",
		address: "হাজী মোঃ সাহাবুদ্দিন পিতা-মৃতঃ আদুল সোবহান তাজ, হারিকেন রোড, পূর্ব ইসলাম নগর, কামরাঙ্গীরচর, ঢাকা",
		district: "Dhaka",
		thana: "Keraniganj", 
		lat: 23.7114231,
		long: 90.377146,
		category: "MFP"
	},
	{
		code: "0007",
		name: "Golambazar-Keraniganj Dhaka",
		phone: "001847099007",
		address: "মোঃ মোশারফ হোসেন বাবুল, গোলাম বাজার, চড়াইল ক্লাব রোড, কেরানীগঞ্জ, ঢাকা",
		district: "Dhaka",
		thana: "Keraniganj",
		lat: 23.6980554,
		long: 90.3919155,
		category: "MFP"
	},
	{
		code: "0008",
		name: "Pallabi-1 Dhaka",
		phone: "001847099008", 
		address: "উম্মে সালমা চৌধুরী, বাড়ি নং-০৫, রোড নং-০৪, ব্লক-এ, পল্লবী, মিরপুর-১১, ঢাকা",
		district: "Dhaka",
		thana: "Pallabi",
		lat: 23.8167822,
		long: 90.366754,
		category: "MFP"
	}
	// Add more branches as needed
]

// Function to search branches by location
function searchBranchesByLocation(searchTerm) {
	const searchLower = searchTerm.toLowerCase()
	const results = []
	
	shaktiBranches.forEach(branch => {
		// Search in multiple fields
		if (branch.name.toLowerCase().includes(searchLower) ||
			branch.district.toLowerCase().includes(searchLower) ||
			branch.thana.toLowerCase().includes(searchLower) ||
			branch.address.toLowerCase().includes(searchLower)) {
			results.push(branch)
		}
	})
	
	return results.slice(0, 5) // Return max 5 results
}

// Function to send branch search results
function sendBranchSearchResults(sender, searchTerm) {
	const results = searchBranchesByLocation(searchTerm)
	
	if (results.length === 0) {
		sendTextMessage(sender, `দুঃখিত, "${searchTerm}" এলাকায় কোন শাখা পাওয়া যায়নি।\n\nঅনুগ্রহ করে অন্য এলাকার নাম লিখুন অথবা আমাদের হেড অফিসে যোগাযোগ করুন:\n\n📞 ফোন: +88 09613-444111\n📍 ঠিকানা: House 04, Road 1, Block A, Section 11, Mirpur, Dhaka 1216`)
		return
	}
	
	let message = `🔍 "${searchTerm}" এলাকায় পাওয়া শাখাসমূহ:\n\n`
	
	results.forEach((branch, index) => {
		message += `${index + 1}. ${branch.name}\n`
		message += `📞 ${branch.phone}\n`
		message += `📍 ${branch.address}\n`
		message += `🗺️ ${branch.thana}, ${branch.district}\n`
		message += `🌐 [Google Map](http://www.google.com/maps/place/${branch.lat},${branch.long})\n\n`
	})
	
	message += `আরও শাখা দেখতে: https://www.shakti.org.bd/coverage`
	
	sendTextMessage(sender, message)
}

// Function to handle location search
function handleLocationSearch(sender, location) {
	sendTextMessage(sender, `🔍 "${location}" এলাকায় শাখা খুঁজছি...`)
	setTimeout(() => {
		sendBranchSearchResults(sender, location)
	}, 1000)
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('Microfinance Bot running on port', app.get('port'))
	// Set up Greeting Text and Persistent Menu when server starts
	setupGreetingText()
	setupPersistentMenu()
})
