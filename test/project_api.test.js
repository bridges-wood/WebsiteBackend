import mongoose from 'mongoose'
import projectHelper from './project_helper.js'
import app from '../app.js'
import Project from '../models/project.js'
import User from '../models/user.js'
import { getMeta } from '../utils/projectFetch.js'

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

// eslint-disable-next-line jest/expect-expect
test('projects are returned as json', async () => {
	await api
		.get('/api/projects')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

describe('refresh', () => {
	test('works when authorized', async () => {
		const res = await 
		api.get('/api/projects')
			.set('Authorization', authToken)
			.query({ refresh: true })
		expect(res.body).toBeDefined()
		expect(res.body.length).toBeGreaterThan(1)
	})

	test('doesn\'t work with no auth header', async () => {
		const res = await
		api.get('/api/projects')
			.query({ refresh: true })
			.expect(401)
		expect(res.body.error).toBeDefined()
		expect(res.body.error).toBe('jwt must be provided')
	})

	test('doesn\'t work when not authorized', async () => {
		const res = await
		api.get('/api/projects')
			.query({ refresh: true })
			.set('Authorization', 'bearer abc')
			.expect(401)
		expect(res.body.error).toBeDefined()
		expect(res.body.error).toBe('jwt malformed')
	})

	test('doesn\'t occur when query absent', async () => {
		const res = await
		api.get('/api/projects')
			.expect(200)
		expect(res.body).toBeDefined()
		expect(res.body).toHaveLength(1)
	})
})

describe('fetching metadata', () => {
	test('from github repository works as expected', async () => {
		const url = 'https://github.com/bridges-wood/Ciphon'
		const metadata = await getMeta(url)
		expect(metadata).toHaveProperty('repoImage')
	})
})

describe('users', () => {
	test('can be added', async () => {
		const res = await api
			.post('/api/users')
			.send({
				username: 'tester',
				name: 'tester',
				password: 'tester'
			})
			.expect(200)
		expect(res.token).toBeDefined()
	})
})

afterAll(() => {
	mongoose.connection.close()
})