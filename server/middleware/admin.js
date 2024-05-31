const { User } = require('../models/user')

module.exports = async function (req, res, next) {
	try {
		const user = await User.findById(req.user._id)
		console.log('User information from request:', user) // Log the user information from the request
		if (!user.isAdmin) return res.status(403).send('Access Denied')
		next()
	} catch (error) {
		console.error('Error fetching user:', error)
		return res.status(500).send('Internal Server Error')
	}
}
