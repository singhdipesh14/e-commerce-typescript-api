import { Request, Response } from "express"
import Review, { ReviewSchemaType } from "../models/Review"
import Product, { ProductSchemaType } from "../models/Product"
import { StatusCodes } from "http-status-codes"
import CustomError from "../errors"
import { HydratedDocument } from "mongoose"
import { checkPermissions } from "../utils"

export const createReview = async (req: Request, res: Response) => {
	const { product: productId } = req.body
	const isValidProduct: HydratedDocument<ProductSchemaType> | null =
		await Product.findOne({ _id: productId })
	if (!isValidProduct) {
		throw new CustomError.NotFoundError(`No Product found with id : ${productId}`)
	}

	const alreadySubmitted: HydratedDocument<ReviewSchemaType> | null =
		await Review.findOne({
			product: productId,
			user: req.user.userId,
		})
	if (alreadySubmitted) {
		throw new CustomError.BadRequestError(
			`Already submitted review for this product`
		)
	}
	req.body.user = req.user.userId
	const review: HydratedDocument<ReviewSchemaType> | null = await Review.create(
		req.body
	)
	res.status(StatusCodes.CREATED).json({ review })
}
export const getAllReviews = async (req: Request, res: Response) => {
	const reviews: HydratedDocument<ReviewSchemaType>[] | null = await Review.find(
		{}
	)
		.populate({ path: "product", select: "name company price" })
		.populate({ path: "user", select: "name" })
	res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}
export const getSingleReview = async (req: Request, res: Response) => {
	const { id: _id } = req.params
	const review: HydratedDocument<ReviewSchemaType> | null = await Review.findOne(
		{ _id }
	)
	if (!review) {
		throw new CustomError.NotFoundError(`No review found with id : ${_id}`)
	}
	res.status(StatusCodes.OK).json({ review })
}
export const updateReview = async (req: Request, res: Response) => {
	const { id: _id } = req.params
	const review: HydratedDocument<ReviewSchemaType> | null = await Review.findOne(
		{ _id }
	)
	if (!review) {
		throw new CustomError.NotFoundError(`No review found with id : ${_id}`)
	}
	checkPermissions(req.user, review.user)
	const { rating, title, comment } = req.body
	review.rating = rating || review.rating
	review.title = title || review.title
	review.comment = comment || review.comment
	await review.save()
	res.status(StatusCodes.OK).json({ review })
}
export const deleteReview = async (req: Request, res: Response) => {
	const { id: _id } = req.params
	const review: HydratedDocument<ReviewSchemaType> | null = await Review.findOne(
		{ _id }
	)
	if (!review) {
		throw new CustomError.NotFoundError(`No review found with id : ${_id}`)
	}
	checkPermissions(req.user, review.user)
	await review.remove()
	res.status(StatusCodes.OK).json({ msg: "Review deleted successfully" })
}

export const getSingleProductReviews = async (req: Request, res: Response) => {
	const { id: productId } = req.params
	const reviews = await Review.find({ product: productId })
	res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}
