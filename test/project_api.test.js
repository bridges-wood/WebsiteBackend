const mongoose = require('mongoose')
const supertest = require('supertest')
const projectHelper = require('./project_helper')
const app = require('../app')

const api = supertest(app)

const Project = require('../models/project')
const User = require('../models/user')

let authToken = ''

beforeEach( async () => {
	await Project.deleteMany({})

	const projectObjects = projectHelper.initialProjects
		.map( p => new Project(p))
	const promiseArray = projectObjects.map(p => p.save())
	await Promise.all(promiseArray)

	await User.deleteMany({})
	const testUser = new User(projectHelper.testUser)
	await testUser.save()
	authToken = `bearer ${await projectHelper.getAuthToken()}`
})

test('projects are returned as json', async () => {
	await api
		.get('/api/projects')
		.set('Authorization', authToken)
		.field('refresh', true)
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

afterAll(() => {
	mongoose.connection.close()
})