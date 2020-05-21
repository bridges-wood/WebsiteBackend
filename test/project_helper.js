const jwt = require('jsonwebtoken')
const Project = require('../models/project.js')
const User = require('../models/user.js')

const initialProjects = [{
	_id: '5a422a851b54a676234d17f7',
	__v: 0,
	id: 1,
	name: 'Test Project',
	description: 'Test description',
	url: 'www.test.com',
	size: 20,
	mainLanguage: 'Java'
}]

const testUser = {
	_id: '5e9ab91fb3a7ec4003510d38',
	username: 'tester',
	name: 'tester',
	password: 'tester',
	admin: true
}

const projectsInDB = async () => {
	const projects = await Project.find({})
	return projects.map((project) => project.toJSON())
}

const storedUsers = async () => {
	const users = await User.find({})
	return users.map(user => user.toJSON())
}

const getAuthToken = async () => {
	const users = await User.find({})
	const user = users[0]
	const userForToken = {
		username: user.username,
		id: user._id
	}

	return jwt.sign(userForToken, process.env.SECRET)
}

module.exports = {
	projectsInDB,
	testUser,
	initialProjects,
	storedUsers,
	getAuthToken
}