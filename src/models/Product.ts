import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "Please provide product name"],
			maxlength: [100, "Name cannot be more than 100 characters"],
		},
		price: {
			type: Number,
			required: [true, "Please provdie price"],
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
			enum: ["office", "kitchen", "bedroom"],
		},
		company: {
			type: String,
			required: [true, "Please provide company name"],
			enum: ["office", "kitchen", "bedroom"],
		},
		colors: {
			type: [],
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
		},
		averageRating: {
			type: Number,
		},
	},
	{
		timestamps: true,
	}
)
