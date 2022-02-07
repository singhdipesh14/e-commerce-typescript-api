import { Request, Response } from "express"
import Order, { OrderSchemaType, SingleCartItemType } from "../models/Order"
import Product, { ProductSchemaType } from "../models/Product"
import { StatusCodes } from "http-status-codes"
import CustomError from "../errors"
import { checkPermissions } from "../utils"
import fakeStripeAPI from "../utils/fakeStripeAPI"

export const getAllOrders = async function (req: Request, res: Response) {
	const orders = await Order.find({})
	res.status(StatusCodes.OK).json({ orders, count: orders.length })
}
export const getSingleOrder = async function (req: Request, res: Response) {
	const { id: _id } = req.params
	const order = await Order.findOne({ _id })
	if (!order) throw new CustomError.NotFoundError(`No order with id : ${_id}`)
	checkPermissions(req.user, order.user)

	res.status(StatusCodes.OK).json({ order })
}
export const getCurrentUserOrders = async function (
	req: Request,
	res: Response
) {
	const { userId } = req.user
	const orders = await Order.find({ user: userId })
	res.status(StatusCodes.OK).json({ orders, count: orders.length })
}
export const createOrder = async function (req: Request, res: Response) {
	const { orderItems, tax, shippingFee } = req.body as OrderSchemaType
	if (!orderItems || orderItems.length < 1) {
		throw new CustomError.BadRequestError("No cart items provided")
	}
	if (!tax || !shippingFee) {
		throw new CustomError.BadRequestError("Please provide tax or shipping fee")
	}
	let order: SingleCartItemType[] = []
	let subtotal = 0
	await Promise.all(
		orderItems.map(async (item: SingleCartItemType) => {
			const dbProduct = await Product.findOne({ _id: item.product })
			if (!dbProduct)
				throw new CustomError.NotFoundError(
					`No product found with id : ${item.product}`
				)
			const { name, price, image, _id } = dbProduct
			const singleOrderItem: SingleCartItemType = {
				amount: item.amount,
				image,
				name,
				price,
				product: _id,
			}
			order = [...order, singleOrderItem]
			subtotal += item.amount * price
		})
	)
	const total = tax + shippingFee + subtotal
	//get client secret
	const paymentIntent = await fakeStripeAPI({
		amount: total,
		currency: "usd",
	})

	const newOrder = await Order.create({
		clientSecret: paymentIntent.clientSecret,
		orderItems: order,
		total,
		tax,
		shippingFee,
		subTotal: subtotal,
		user: req.user.userId,
	})
	res
		.status(StatusCodes.CREATED)
		.json({ order: newOrder, clientSecret: newOrder.clientSecret })
}
export const updateOrder = async function (req: Request, res: Response) {
	const { id: _id } = req.params
	const { paymentId } = req.body
	const order = await Order.findOne({ _id })
	if (!order) throw new CustomError.NotFoundError(`No order with id : ${_id}`)
	checkPermissions(req.user, order.user)

	order.paymentId = paymentId
	order.status = "paid"

	await order.save()

	res.status(StatusCodes.OK).json({ order })
}
