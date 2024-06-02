const express = require('express')
const auth = require('../middleware/auth')
const { Reply, validateReply } = require('../models/replies')
const _ = require('lodash')
const { Post } = require('../models/post')
const router = express.Router()

router.post('/create/:id', auth, async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.id })
		if (!post) {
			return res.status(404).send("The Post with given ID doesn't exists!")
		}

		const { error } = validateReply(req.body)
		if (error) return res.status(400).send(error.details[0].message)

		const reply = new Reply({
			post: req.params.id,
			comment: req.body.comment,
			author: req.user._id,
		})
		await reply.save()

		const reply_populated = await Reply.findOne({ _id: reply._id }).populate(
			'author',
			'name -_id',
		)
		res.send(reply_populated)
	} catch (error) {
		console.error('Error creating reply:', error)
		res.status(500).send('Internal server error')
	}
})

router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.id })
		if (!post) {
			return res.status(404).send("The post with the given ID doesn't exist.")
		}

		const replies = await Reply.find({ post: req.params.id }).populate(
			'author',
			'name username',
		)
		res.send(replies)
	} catch (error) {
		console.error('Error fetching replies:', error)
		res.status(500).send('Internal server error')
	}
})

router.put('/like/:id', auth, async (req, res) => {
	try {
		const reply = await Reply.findOne({ _id: req.params.id })
		if (!reply) {
			return res.status(400).send("Reply doesn't exist")
		}
		if (reply.author == req.user._id) {
			return res.status(400).send("You can't upvote your own reply")
		}
		const upvoteArray = reply.upvotes
		const index = upvoteArray.indexOf(req.user._id)
		if (index === -1) {
			upvoteArray.push(req.user._id)
		} else {
			upvoteArray.splice(index, 1)
		}
		reply.upvotes = upvoteArray
		await reply.save()

		const reply_new = await Reply.findOne({ _id: reply._id }).populate(
			'author',
			'name username',
		)
		res.send(reply_new)
	} catch (error) {
		console.error('Error updating reply:', error)
		res.status(500).send('Internal server error')
	}
})

module.exports = router
