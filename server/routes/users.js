const express = require('express')
const bcrypt = require('bcrypt')
const { User, validateUser } = require('../models/user')
const nodemailer = require('nodemailer')
const auth = require('../middleware/auth')

const router = express.Router()

// Function to send registration confirmation email
async function sendRegistrationEmail(user) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'essthsforum@gmail.com',
			pass: 'Essthsforum2006?',
		},
	})

	const mailOptions = {
		from: 'essthsforum@gmail.com',
		to: 'adembensalem8@gmail.com',
		subject: 'New User Registration',
		html: `
            <h2>Registration Confirmation</h2>
            <p>Hello Admin,</p>
            <p>A new user has registered with the following details:</p>
            <ul>
                <li><strong>Name:</strong> ${user.name}</li>
                <li><strong>Email:</strong> ${user.email}</li>
                <li><strong>Username:</strong> ${user.username}</li>
                <li><strong>Role:</strong> ${user.role}</li>
                <li><strong>CIN Number:</strong> ${user.cinNumber}</li>
            </ul>
            <p>Please take necessary action to confirm the user's registration.</p>
            <p>Regards,</p>
            <p>Your Website Team</p>
        `,
	}

	try {
		await transporter.sendMail(mailOptions)
		console.log('Email sent successfully')
	} catch (error) {
		console.error('Error sending email:', error)
	}
}

// PUT endpoint to update user role
router.put('/:id/role', async (req, res) => {
	const { id } = req.params
	const { role } = req.body

	try {
		let user = await User.findById(id)
		if (!user) {
			return res.status(404).send('User not found')
		}

		if (role !== 'guest') {
			user.status = 'confirmed' // Update status to confirmed if role changed from guest
		}

		user.role = role
		await user.save()

		res.send(user)
	} catch (error) {
		console.error('Error updating user role:', error)
		res.status(500).send('Internal server error')
	}
})

// POST endpoint for user registration
router.post('/register', async (req, res) => {
	const { error } = validateUser(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	let user = await User.findOne({ email: req.body.email })
	if (user) return res.status(400).send('User already registered')

	let defaultRole = 'guest'
	if (req.body.isAdmin) {
		defaultRole = 'admin'
	}

	user = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: await bcrypt.hash(req.body.password, 10),
		role: defaultRole,
		cinNumber: req.body.cinNumber,
	})

	try {
		await user.save()
		sendRegistrationEmail(user)
		res.send('Registration successful. Please wait for admin confirmation.')
	} catch (err) {
		console.error('Error registering user:', err)
		res.status(500).send('Internal server error')
	}
})

// GET endpoint to get a user by ID
router.get('/:id', async (req, res) => {
	const user = await User.findById(req.params.id).select('-password')
	if (!user)
		return res.status(404).send("This user doesn't exist in the database!")
	res.send(user)
})

// GET endpoint to get current user profile
router.get('/me', auth, async (req, res) => {
	const user = await User.findById(req.session.userId).select('-password')
	if (!user)
		return res.status(404).send("This user doesn't exist in the database!")
	res.send(user)
})

// POST endpoint for user login
router.post('/login', async (req, res) => {
	const { email, password } = req.body

	if (!email || !password)
		return res.status(400).send('Email and password are required')

	let user = await User.findOne({ email })
	if (!user) return res.status(400).send('Invalid email or password')

	const validPassword = await bcrypt.compare(password, user.password)
	if (!validPassword) return res.status(400).send('Invalid email or password')

	// Set user's session upon successful login
	req.session.userId = user._id

	res.send('Login successful')
})

// POST endpoint for user logout
router.post('/logout', (req, res) => {
	// Destroy the user's session upon logout
	req.session.destroy((err) => {
		if (err) {
			console.error('Error destroying session:', err)
			return res.status(500).send('Internal server error')
		}
		res.send('Logged out successfully')
	})
})

module.exports = router
