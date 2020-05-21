import logger from './logger.js'

const requestLogger = (req, res, next) => {
	logger.info('Method:', req.method)
	logger.info('Path: ', req.path)
	logger.info('Body: ', req.body)
	logger.info('---')
	next()
}

const tokenExtractor = (req, res, next) => {
	const auth = req.get('authorization')
	if (auth && auth.toLowerCase().startsWith('bearer ')) {
		req.token = auth.substring(7)
	} else {
		req.token = null
	}

	next()
}

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
	logger.error(err.message)
	if (err.name === 'CastError' && err.kind === 'ObjectId') {
		return res.status(400).send({ error: 'malformatted id' })
	} if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message })
	} if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			error: err.message,
		})
	}
	next(err)
}


export default {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
}
