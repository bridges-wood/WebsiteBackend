const projectsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Project = require('../models/project')
const User = require('../models/user')
const refresh = require('../utils/projectFetch')


projectsRouter.get('/', async (req, res) => {
	console.log('here')
	
	const { body } = req
	const { token } = req

	if ( body.refresh ) {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if ( !token || !decodedToken.id ) {
			res.status(401).json({ error: 'token missing or invalid id'})
		}

		const user = await User.findById(decodedToken.id)
		if ( !user.admin ) {
			res.status(401).json({ error: 'you do not have administrator privledges'})
		} else {
			try {
				const refreshedProjects = refresh()
				res.json(refreshedProjects)
			} catch (error) {
				res.status(503).json({ error: 'database could not be refreshed'})
			}
		}
	} else {
		const projects = await Project.find({})
		res.json(projects).end()
	}
})

module.exports = projectsRouter