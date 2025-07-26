'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const fs = require('fs')
const csv = require('csv-parser')
const app = express()

// Global variable to store location data
let locationData = []

// Comprehensive district and thana mapping with spelling variations
const districtMapping = {
	// Bengali to English
	'ঢাকা': ['dhaka'],
	'চট্টগ্রাম': ['chattogram', 'chittagong'],
	'নারায়ণগঞ্জ': ['narayanganj'],
	'গাজীপুর': ['gazipur'],
	'খুলনা': ['khulna'],
	'কুমিল্লা': ['cumilla', 'comilla'],
	'বগুড়া': ['bogura', 'bogra'],
	'রাজশাহী': ['rajshahi'],
	'যশোর': ['jashore', 'jessore'],
	'নাটোর': ['natore'],
	'নওগাঁ': ['naogaon'],
	'ফেনী': ['feni'],
	'জামালপুর': ['jamalpur'],
	'মানিকগঞ্জ': ['manikganj'],
	'ফরিদপুর': ['faridpur'],
	'পাবনা': ['pabna'],
	'নীলফামারী': ['nilphamari'],
	'বরিশাল': ['barishal', 'barisal'],
	'কক্সবাজার': ['coxsbazar', 'cox\'s bazar'],
	'মুন্সিগঞ্জ': ['munshiganj'],
	
	// English variations
	'jashore': ['jashore', 'jessore'],
	'jessore': ['jashore', 'jessore'],
	'chattogram': ['chattogram', 'chittagong'],
	'chittagong': ['chattogram', 'chittagong'],
	'cumilla': ['cumilla', 'comilla'],
	'comilla': ['cumilla', 'comilla'],
	'bogura': ['bogura', 'bogra'],
	'bogra': ['bogura', 'bogra'],
	'barishal': ['barishal', 'barisal'],
	'barisal': ['barishal', 'barisal'],
	
	// Common thana names
	'mirpur': ['pallabi'],
	'মিরপুর': ['pallabi'],
	'pallabi': ['pallabi'],
	'পল্লবী': ['pallabi'],
	'jatrabari': ['jatrabari'],
	'যাত্রাবাড়ী': ['jatrabari'],
	'যাত্রাবাড়ি': ['jatrabari'],
	'keraniganj': ['keraniganj'],
	'কেরানীগঞ্জ': ['keraniganj'],
	'savar': ['savar'],
	'সাভার': ['savar'],
	'khilkhet': ['khilkhet'],
	'খিলক্ষেত': ['khilkhet'],
	'lalbag': ['lalbag'],
	'লালবাগ': ['lalbag'],
	'kotwali': ['kotwali'],
	'কোতয়ালী': ['kotwali'],
	'khilgaon': ['khilgaon'],
	'খিলগাঁও': ['khilgaon'],
	'kadamtoli': ['kadamtoli'],
	'কদমতলী': ['kadamtoli'],
	'demra': ['demra'],
	'ডেমরা': ['demra'],
	'gulshan': ['gulshan'],
	'গুলশান': ['gulshan'],
	'vatara': ['vatara'],
	'ভাটারা': ['vatara'],
	'sutrapur': ['sutrapur'],
	'সুত্রাপুর': ['sutrapur'],
	'kamrangirchor': ['kamrangirchor'],
	'কামরাঙ্গীরচর': ['kamrangirchor'],
	
	// Additional locations that appear in addresses
	'উলুকান্দি': ['habiganj', 'hobiganj'],
	'ulukandi': ['habiganj', 'hobiganj'],
	'আউসকান্দি': ['habiganj', 'hobiganj'],
	'aushkandi': ['habiganj', 'hobiganj'],
	'habiganj': ['habiganj', 'hobiganj'],
	'হবিগঞ্জ': ['habiganj', 'hobiganj'],
	'nabiganj': ['nabiganj'],
	'নবিগঞ্জ': ['nabiganj'],
	
	// Additional districts
	'কুষ্টিয়া': ['kushtia'],
	'কুষ্টিয়া': ['kushtia'],
	'kushtia': ['kushtia']
}

// Facebook Page Access Token
const token = 'EAAPKDQxpu94BPKD8cvahCt5b1r01WkSaj6WTZBlSJkfbgoxiZBKL7ExPZAZCVLaNdkfy6ZBXn1c4TWZBpJ0ZA3v5RlrPqpoToGIxFoO0PDcihlROoMr2IZC1CXzxGE0MgQGWjmHUyytOcZAWUSexapMaLEzdzgpJyAKlzExv3J9C3KBcwosEqWmvM6i45UqCohOeoP1z4yMd4tgZDZD'

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// Load CSV data on startup
function loadLocationData() {
	fs.createReadStream('Coverage SHAKTI.csv')
		.pipe(csv())
		.on('data', (row) => {
			locationData.push(row)
		})
		.on('end', () => {
			console.log('Location data loaded successfully:', locationData.length, 'records')
		})
		.on('error', (error) => {
			console.error('Error loading CSV:', error)
		})
}

// Function to search locations by district or upazila
function searchLocations(searchTerm) {
	const results = []
	const searchLower = searchTerm.toLowerCase()

	// Get all possible search terms for this input
	let searchTerms = [searchLower]

	// If it's a known district, get all its variations
	if (districtMapping[searchTerm]) {
		searchTerms = districtMapping[searchTerm]
	} else if (districtMapping[searchLower]) {
		searchTerms = districtMapping[searchLower]
	}

	console.log('Searching for terms:', searchTerms)

	locationData.forEach(location => {
		const district = location.District ? location.District.toLowerCase() : ''
		const thana = location.Thana ? location.Thana.toLowerCase() : ''
		const address = location.Address ? location.Address.toLowerCase() : ''

		// Check if any search term matches district, thana, or address
		for (let term of searchTerms) {
			if (district === term || thana === term || address.includes(term)) {
				results.push(location)
				break // Don't add the same location twice
			}
		}
	})

	console.log('Found', results.length, 'results for:', searchTerm)
	return results
}

// Function to format location results with pagination
function formatLocationResults(locations) {
	if (locations.length === 0) {
		return "দুঃখিত, আপনার এলাকায় কোন শাখা পাওয়া যায়নি। অনুগ্রহ করে অন্য এলাকার নাম দিন।"
	}
	
	// Split locations into chunks of 5 per message
	const chunks = []
	for (let i = 0; i < locations.length; i += 5) {
		chunks.push(locations.slice(i, i + 5))
	}
	
	return chunks.map((chunk, chunkIndex) => {
		let message = chunkIndex === 0 ? 
			`📍 আপনার এলাকায় পাওয়া শাখাসমূহ (${locations.length}টি):\n\n` :
			`📍 শাখাসমূহ (পরবর্তী অংশ):\n\n`
		
		chunk.forEach((location, index) => {
			const globalIndex = chunkIndex * 5 + index + 1
			message += `${globalIndex}। ${location['Branch Name']}\n`
			message += `📍 ${location.Address}\n`
			message += `📞 ${location['Phone Number']}\n\n`
		})
		
						if (chunkIndex === chunks.length - 1) {
					message += "আপনার যোগাযোগের নাম্বার দিলে আপনার নিকটস্থ লোন ম্যানেজার যোগাযোগ করতে পারবেন।"
				}
		
		return message
	})
}

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
					let text = event.message.text
					console.log('Received text:', text)
					
					// Check if this is a location search
					const searchResults = searchLocations(text)
					if (searchResults.length > 0) {
						// This is a location search
						const locationMessages = formatLocationResults(searchResults)
						
						// Send multiple messages if there are chunks
						if (Array.isArray(locationMessages)) {
							locationMessages.forEach((message, index) => {
								setTimeout(() => {
									sendTextMessage(event.sender.id, message)
								}, index * 1000) // Send each message with 1 second delay
							})
						} else {
							sendTextMessage(event.sender.id, locationMessages)
						}
					} else {
						// This is not a location search, send error message
						sendTextMessage(event.sender.id, "দুঃখিত, আমি বুঝতে পারছি না। অনুগ্রহ করে আপনার এলাকার নাম সঠিকভাবে লিখুন (যেমন: ঢাকা, মিরপুর, যশোর)।")
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
		"আপনি লোন ম্যানেজার এর সাথে যোগযোগ করতে চাইলে, আপনার জেলা অথবা উপজেলার নাম দিন।")
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
	// Load location data when server starts
	loadLocationData()
})
