import mongoose, { Schema, Types } from "mongoose"
import Product from "./Product"

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

ReviewSchema.statics.calculateAverageRating = async function (productId) {
	const agg = [
		{
			$match: {
				product: productId,
			},
		},
		{
			$group: {
				_id: null,
				averageRating: {
					$avg: "$rating",
				},
				numOfReviews: {
					$sum: 1,
				},
			},
		},
	]
	const result = await this.aggregate(agg)
	try {
		await Product.findOneAndUpdate(
			{ _id: productId },
			{
				averageRating: Math.ceil(result[0]?.averageRating || 0),
				numOfReviews: result[0]?.numOfReviews || 0,
			}
		)
	} catch (error) {
		console.log(error)
	}
}

ReviewSchema.post("save", async function () {
	await this.constructor.calculateAverageRating(this.product)
})
ReviewSchema.post("remove", async function () {
	await this.constructor.calculateAverageRating(this.product)
})

export default mongoose.model<ReviewSchemaType>("reviews", ReviewSchema)
