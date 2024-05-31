const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
require('dotenv').config() // Load environment variables

const store = new MongoDBStore({
	uri: process.env.MONGODB_URI, // Use your MongoDB connection string from environment variable
	collection: 'sessions',
})

module.exports = session({
	secret: process.env.SESSION_SECRET, // Use session secret from environment variable
	resave: false,
	saveUninitialized: false,
	store: store,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24, // 1 day
	},
})
