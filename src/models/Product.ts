import { number } from "joi"
import mongoose, { Model, Schema, Types } from "mongoose"
import Review from "./Review"

export type ProductSchemaType = {
	name: string
	price: number
	description: string
	image: string
	category: string
	company: string
	colors: string[]
	featured: boolean
	freeShipping: boolean
	inventory: number
	averageRating: number
	numOfReviews: number
	user: Types.ObjectId
}

const ProductSchema = new mongoose.Schema<ProductSchemaType, any>(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "Please provide product name"],
			maxlength: [100, "Name cannot be more than 100 characters"],
		},
		price: {
			type: Number,
			required: [true, "Please provide price"],
			default: 0,
		},
		description: {
			type: String,
			required: [true, "Please provide description"],
			trim: true,
			maxlength: [1000, "Description cannot be longer than 1000 characters"],
		},
		image: {
			type: String,
			default: "/uploads/example.jpeg",
			required: [true, "Please provide image URL"],
		},
		category: {
			type: String,
			required: [true, "Please provide category"],
			enum: {
				values: ["office", "kitchen", "bedroom"],
				message: "{VALUE} is not supported",
			},
		},
		company: {
			type: String,
			required: [true, "Please provide company name"],
			enum: {
				values: ["ikea", "marcos", "liddy"],
				message: "{VALUE} is not supported",
			},
		},
		colors: {
			type: [String],
			default: ["#000"],
			required: true,
		},
		featured: {
			type: Boolean,
			default: false,
		},
		freeShipping: {
			type: Boolean,
			default: false,
		},
		inventory: {
			type: Number,
			required: [true, "Please provide inventory"],
			default: 15,
		},
		averageRating: {
			type: Number,
			default: 0,
		},
		numOfReviews: {
			type: Number,
			default: 0,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

ProductSchema.virtual("reviews", {
	ref: "reviews",
	localField: "_id",
	foreignField: "product",
	justOne: false,
	match: { rating: 5 },
})

ProductSchema.pre("remove", async function () {
	await Review.deleteMany({ product: this._id })
})

const ProductModel = mongoose.model<ProductSchemaType>(
	"products",
	ProductSchema
)

export default ProductModel
