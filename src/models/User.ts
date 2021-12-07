import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"

export type UserSchemaType = {
	name: string
	email: string
	password: string
	role: string
	comparePassword: (candidatePassword: string) => boolean
}

const UserSchema = new mongoose.Schema<UserSchemaType>({
	name: {
		type: String,
		required: [true, "Please provide name"],
		minlength: 3,
		maxlength: 50,
	},
	email: {
		type: String,
		required: [true, "Please provide email"],
		validate: {
			validator: validator.isEmail,
			message: "Please provide valid email",
		},
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please provide password"],
		minlength: 6,
	},
	role: {
		type: String,
		enum: ["admin", "user"],
		default: "user",
	},
})

UserSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (
	candidatePassword: string
) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password)
	return isMatch
}

const UserModel = mongoose.model<UserSchemaType>("user", UserSchema)

export default UserModel
