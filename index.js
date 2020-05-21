import http from 'http'
import app from './app.js'
import config from './utils/config.js'

const server = http.createServer(app)

server.listen(config.PORT, () => {
	console.log(`Server running on port ${config.PORT}`)
})