import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		minlength: 5,
		unique: true
	},
	name: String,
	passwordHash: String,
	admin: {
		type: Boolean,
		default: false
	}
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject._v
		delete returnedObject.passwordHash
	},
})

const User = mongoose.model('User', userSchema)

export default User
