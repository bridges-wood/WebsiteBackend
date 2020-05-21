const router = require('express').Router()
const Project = require('../models/project')
const User = require('../models/user')

router.post('/reset', async (req, res) => {
	await Project.deleteMany({})
	await User.deleteMany({})

	res.status(204).end()
})

module.exports = router