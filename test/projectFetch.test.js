import { getMeta } from '../utils/projectFetch.js'

describe('fetching metadata', () => {
	test('from github repository works as expected', async () => {
		const url = 'https://github.com/bridges-wood/Ciphon'
		const metadata = await getMeta(url)
		expect(metadata).toHaveProperty('repoImage')
	})
})