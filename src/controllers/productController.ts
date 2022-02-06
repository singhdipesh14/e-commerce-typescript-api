import { Request, Response } from "express"
import { v2 as cloudinary } from "cloudinary"
import Product from "../models/Product"
import { StatusCodes } from "http-status-codes"
import CustomError from "../errors"
import { HydratedDocument } from "mongoose"
import { ProductSchemaType } from "../models/Product"
import fs from "fs"

export const createProduct = async (req: Request, res: Response) => {
	const product: HydratedDocument<ProductSchemaType> | null =
		await Product.create({ ...req.body, user: req.user.userId })
	res.status(StatusCodes.CREATED).json({ product })
}
export const getAllProducts = async (req: Request, res: Response) => {
	const products: HydratedDocument<ProductSchemaType>[] | null =
		await Product.find({})
	res.status(StatusCodes.OK).json({ products, count: products.length })
}
export const getSingleProduct = async (req: Request, res: Response) => {
	const product: HydratedDocument<ProductSchemaType> | null =
		await Product.findOne({ _id: req.params.id }).populate("reviews")
	if (!product) {
		throw new CustomError.NotFoundError(
			`No product found with id : ${req.params.id}`
		)
	}
	res.status(StatusCodes.OK).json({ product })
}

export const updateProduct = async (req: Request, res: Response) => {
	const product: HydratedDocument<ProductSchemaType> | null =
		await Product.findOneAndUpdate(
			{ _id: req.params.id },
			{ ...req.body },
			{
				new: true,
				runValidators: true,
			}
		)
	if (!product) {
		throw new CustomError.NotFoundError(
			`No product found with id : ${req.params.id}`
		)
	}
	res.status(StatusCodes.OK).json({ product })
}

export const deleteProduct = async (req: Request, res: Response) => {
	const product: HydratedDocument<ProductSchemaType> | null =
		await Product.findOne({
			_id: req.params.id,
		})
	if (!product) {
		throw new CustomError.NotFoundError(
			`No product found with id : ${req.params.id}`
		)
	}
	await product.remove()
	res.status(StatusCodes.OK).json({ msg: "Success! Product Removed" })
}

export const uploadImage = async (req: Request, res: Response) => {
	if (!req.files) throw new CustomError.BadRequestError("No file Uploaded")
	const productImage = req.files.image
	if (Array.isArray(productImage)) {
		throw new CustomError.BadRequestError("Please Upload only one file")
	}
	if (!productImage.mimetype.startsWith("image")) {
		throw new CustomError.BadRequestError("Please only upload images")
	}
	const maxSize = 1024 * 1024
	if (productImage.size > maxSize) {
		throw new CustomError.BadRequestError("Image size must be less than 1MB")
	}
	const result = await cloudinary.uploader.upload(productImage.tempFilePath, {
		use_filename: true,
		folder: "e-commerce-typescript",
	})
	fs.unlinkSync(productImage.tempFilePath)
	return res.status(StatusCodes.OK).json({ image: result.secure_url })
}
