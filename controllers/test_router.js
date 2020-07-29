import express from 'express'
import Project from '../models/project.js'
import User from '../models/user.js'

const router = express.Router()

router.post('/reset', async (req, res) => {
	await Project.deleteMany({})
	await User.deleteMany({})

	res.status(204).end()
})

router.post('/projects', async (req, res) => {
	const project = req.body
	const formatted = new Project({...project})

	await formatted.save()

	res.status(200).end()
})

export default router