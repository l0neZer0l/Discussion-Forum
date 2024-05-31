const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const adminMiddleware = require('../middleware/admin')
const { User, validateUser } = require('../models/user')
const nodemailer = require('nodemailer')
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

// PUT endpoint to update user role (Protected route accessible only by admins)
router.put('/:id/role', adminMiddleware, async (req, res) => {
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

// GET endpoint to get a user by ID
router.get('/:id', async (req, res) => {
	try {
		const userId = req.params.id
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).send('Invalid user ID')
		}

		const user = await User.findById(userId).select('-password')
		if (!user) {
			return res.status(404).send("This user doesn't exist in the database!")
		}

		res.send(user)
	} catch (error) {
		console.error('Error fetching user profile:', error)
		res.status(500).send('Internal server error')
	}
})

// GET endpoint to get current user profile
router.get('/me', async (req, res) => {
	try {
		// Check if user session exists
		if (!req.session.userId) {
			return res.status(401).send('Unauthorized')
		}

		// Fetch user data using session userId
		const user = await User.findById(req.session.userId).select('-password')
		if (!user) {
			return res.status(404).send("This user doesn't exist in the database!")
		}

		res.send(user)
	} catch (error) {
		console.error('Error fetching user profile:', error)
		res.status(500).send('Internal server error')
	}
})

// POST endpoint for user login
router.post('/login', async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(400).send('Email and password are required')
	}

	try {
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).send('Invalid email or password')
		}

		const validPassword = await bcrypt.compare(password, user.password)
		if (!validPassword) {
			return res.status(400).send('Invalid email or password')
		}

		// Set user's session upon successful login
		req.session.userId = user._id

		res.send('Login successful')
	} catch (error) {
		console.error('Error logging in user:', error)
		res.status(500).send('Internal server error')
	}
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
