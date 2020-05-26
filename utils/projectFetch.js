import axios from 'axios'
import parser from 'page-metadata-parser'
import fetch from 'node-fetch'
import domino from 'domino'
import Project from '../models/project.js'

const baseUrl = 'https://api.github.com'
const user = 'bridges-wood'
const config = {
	headers: { Authorization: `token ${process.env.API_KEY}` }
}
const metaRules = {
	rules: [
		['meta[name="twitter:image:src"]', element => element.getAttribute('content')]
	]
}

export const getREADME = async (name) => {
	try {
		const res = await axios.get(`${baseUrl}/repos/${user}/${name}/readme`, config)
		const readme = await axios.get(res.data.download_url)
		return readme.data
	} catch (error) {
		return null
	}
}

export const getLanguages = async (name) => {
	try {
		const res = await axios.get(`${baseUrl}/repos/${user}/${name}/languages`, config)
		const languages = res.data
		return languages
	} catch (error) {
		return null
	}
}

export const getMeta = async (repoURL) => {
	const res = await fetch(repoURL)
	const html = await res.text()
	const doc = domino.createWindow(html).document
	const metadata = parser.getMetadata(doc, repoURL, {repoImage: metaRules})
	return metadata
}

export const formatRepo = async (repo) => {
	const [README, languages, metadata] = await Promise.all([
		getREADME(repo.name),
		getLanguages(repo.name),
		getMeta(repo.html_url)
	])
	return {
		id: repo.id,
		name: repo.name,
		description: repo.description,
		url: repo.html_url,
		size: repo.size,
		mainLanguage: repo.language,
		README,
		languages,
		metadata
	}
}

const refresh = async () => {
	const res = await axios.get(`${baseUrl}/users/${user}/repos`, config)
	const repos = await Promise.all(res.data.map(async (repo) => formatRepo(repo)))
	const transformed = repos.map(project => new Project({...project}))
	try {
		await Project.deleteMany({})
		transformed.forEach(async (project) => await project.save())
		return repos
	} catch (error) {
		return { error: 'there was an error updating the database' }
	}
}

export default refresh