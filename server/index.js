require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const users = require('./routes/users')
const posts = require('./routes/posts')
const tags = require('./routes/tags')
const replies = require('./routes/replies')
const app = express()

// MongoDB URL
const mongoDBURL = process.env.mongoDBURL || 'mongodb://localhost:27017/reforum'

// Connect to MongoDB
mongoose
	.connect(mongoDBURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => console.error('Could not connect to MongoDB:', err))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	}),
)

// Session middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'ESSTHSFORUM',
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: mongoDBURL }),
		cookie: { maxAge: 180 * 60 * 1000 }, // 3 hours
	}),
)

// Routes
app.get('/', (req, res) => {
	res.send('Request successfully sent!')
})

app.use('/users', users)
app.use('/posts', posts)
app.use('/tags', tags)
app.use('/replies', replies)

// Start the server
const port = process.env.PORT || 4000
app.listen(port, () => {
	console.log(`App running on port ${port}`)
})
