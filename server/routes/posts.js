const express = require('express')
const router = express.Router()
const { Post, validatePost } = require('../models/post')
const { Tag } = require('../models/tag')

// Get all posts
router.get('/', async (req, res) => {
	const posts = await Post.find().sort('name')
	res.send(posts)
})

// Get a single post by ID
router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.id })
		if (!post) {
			return res.status(404).send('The post with the given ID was not found.')
		}
		res.send(post)
	} catch (error) {
		console.error('Error fetching post:', error)
		res.status(500).send('Internal server error')
	}
})

// Create a new post
router.post('/create', async (req, res) => {
	console.log('POST /posts/ request received with body:', req.body) // Debug log
	const { error } = validatePost(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	const tags = await Tag.find({
		_id: { $in: req.body.tags.map((tag) => tag._id) },
	})
	if (tags.length !== req.body.tags.length)
		return res.status(400).send('Invalid tags.')

	let post = new Post({
		title: req.body.title,
		description: req.body.description,
		tags: req.body.tags,
		author: req.user._id, // assuming author is passed in req.body
	})

	post = await post.save()
	res.send(post)
})

// Update an existing post
router.put('/:id', async (req, res) => {
	const { error } = validatePost(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	const tags = await Tag.find({
		_id: { $in: req.body.tags.map((tag) => tag._id) },
	})
	if (tags.length !== req.body.tags.length)
		return res.status(400).send('Invalid tags.')

	try {
		const post = await Post.findOneAndUpdate(
			{ _id: req.params.id },
			{
				title: req.body.title,
				description: req.body.description,
				tags: req.body.tags,
			},
			{ new: true },
		)

		if (!post) {
			return res.status(404).send('The post with the given ID was not found.')
		}
		res.send(post)
	} catch (error) {
		console.error('Error updating post:', error)
		res.status(500).send('Internal server error')
	}
})

// Delete a post
router.delete('/:id', async (req, res) => {
	try {
		const post = await Post.findByIdAndRemove(req.params.id)
		if (!post) {
			return res.status(404).send('The post with the given ID was not found.')
		}
		res.send(post)
	} catch (error) {
		console.error('Error deleting post:', error)
		res.status(500).send('Internal server error')
	}
})

module.exports = router
