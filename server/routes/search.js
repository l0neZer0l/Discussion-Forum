// routes/search.js

const express = require('express')
const router = express.Router()
const Post = require('../models/post') // Import your Post model

// Route to handle search queries
router.get('/', async (req, res) => {
	try {
		const searchTerm = req.query.q
		const results = await Post.find({ $text: { $search: searchTerm } })
		res.json(results)
	} catch (error) {
		console.error('Error searching posts:', error)
		res.status(500).json({ error: 'An error occurred while searching posts' })
	}
})

module.exports = router
