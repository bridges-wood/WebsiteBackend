import express from 'express'
import jwt from 'jsonwebtoken'
import Project from '../models/project.js'
import User from '../models/user.js'
import refresh from '../utils/projectFetch.js'

const projectsRouter = express.Router()


projectsRouter.get('/', async (req, res) => {
	
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