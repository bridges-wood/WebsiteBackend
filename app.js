import express, { json } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import config from './utils/config.js'
import logger from './utils/logger.js'
import middleware from './utils/middleware.js'

const app = express()
app.set('trust proxy', 'loopback')

app.use(middleware.tokenExtractor)

import projectsRouter from './controllers/projects.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import testingRouter from './controllers/test_router.js'

logger.info('Connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, 
	{ useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		logger.info('Connected to MongoDB')
	})
	.catch((error) => {
		logger.error('Error connecting to MongoDB', error.message)
	})

app.use(cors())
app.use(json())
app.use(middleware.requestLogger)
app.use('/api/projects', projectsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if(process.env.NODE_ENV === 'test'){
	app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

export default app