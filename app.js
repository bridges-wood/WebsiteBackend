const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const app = express()
app.set('trust proxy', 'loopback')

app.use(middleware.tokenExtractor)

const projectsRouter = require('./controllers/projects')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

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
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/projects', projectsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if(process.env.NODE_ENV === 'test'){
	const testingRouter = require('./controllers/test_router')
	app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

module.exports = app