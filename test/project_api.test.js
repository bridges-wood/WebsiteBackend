import mongoose from 'mongoose'
import projectHelper from './project_helper.js'
import app from '../app.js'
import Project from '../models/project.js'
import User from '../models/user.js'

const api = projectHelper.supertest(app)

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