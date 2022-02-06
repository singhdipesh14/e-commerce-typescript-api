import mongoose, { Schema, Types } from "mongoose"

export type ReviewSchemaType = {
	rating: number
	title: string
	comment: string
	user: Types.ObjectId
	product: Types.ObjectId
}

const ReviewSchema = new mongoose.Schema<ReviewSchemaType>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		product: {
			type: Schema.Types.ObjectId,
			ref: "products",
			required: true,
		},
		title: {
			type: String,
			required: [true, "Please provide review Title"],
			maxlength: 100,
			trim: true,
		},
		rating: {
			type: Number,
			required: [true, "Please provide rating"],
			max: 5,
			min: 1,
		},
		comment: {
			type: String,
			required: [true, "Please provide comment"],
			trim: true,
		},
	},
	{ timestamps: true }
)

ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

export default mongoose.model<ReviewSchemaType>("reviews", ReviewSchema)
