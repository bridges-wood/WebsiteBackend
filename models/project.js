import mongoose from 'mongoose'

const projectSchema = mongoose.Schema({
	id: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	size: {
		type: Number,
		required: true
	},
	mainLanguage: {
		type: String,
		required: true
	},
	README: {
		type: String,
		default: null
	},
	languages: {
		type: Object,
		default: null	
	},
	metadata: {
		type: Object,
		default: null
	}
})

projectSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		delete returnedObject._id
		delete returnedObject._v
	},
})

const Project = mongoose.model('Project', projectSchema)

export default Project