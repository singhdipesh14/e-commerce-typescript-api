import mongoose, { Model, Schema, Types } from "mongoose"

export type SingleCartItemType = {
	name: string
	image: string
	price: number
	amount: number
	product: Types.ObjectId
}

const SingleCartItemSchema = new mongoose.Schema<SingleCartItemType>({
	name: { type: String, required: true },
	image: { type: String, required: true },
	price: { type: Number, required: true },
	amount: { type: Number, required: true },
	product: {
		type: Schema.Types.ObjectId,
		ref: "products",
		required: true,
	},
})

export type OrderSchemaType = {
	tax: number
	shippingFee: number
	subTotal: number
	total: number
	orderItems: SingleCartItemType[]
	status: string
	user: Types.ObjectId
	clientSecret: string
	paymentId: string
}

const OrderSchema = new mongoose.Schema<OrderSchemaType>(
	{
		tax: {
			type: Number,
			required: [true, "Please provide tax"],
		},
		clientSecret: {
			type: String,
			required: [true, "Please provide client secret"],
		},
		orderItems: {
			type: [SingleCartItemSchema],
		},
		paymentId: {
			type: String,
			// required: true,
		},
		shippingFee: {
			type: Number,
			required: [true, "Please provide shipping fee"],
		},
		status: {
			type: String,
			enum: ["pending", "failed", "paid", "delivered", "cancelled"],
			default: "pending",
			required: true,
		},
		subTotal: {
			type: Number,
			required: [true, "Please provide sub-total value"],
		},
		total: {
			type: Number,
			required: [true, "Please provide total value"],
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
	},
	{ timestamps: true }
)

export default mongoose.model<OrderSchemaType>("orders", OrderSchema)
