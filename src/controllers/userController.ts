import { Request, Response } from "express"
import User from "../models/User"
import { StatusCodes } from "http-status-codes"
import CustomError from "../errors"
import { createTokenUser, jwt, checkPermissions } from "../utils"

const { attachCookiesToResponse } = jwt

export const getAllUsers = async (req: Request, res: Response) => {
	const users = await User.find({ role: "user" }).select("-password")
	res.status(StatusCodes.OK).json({ users })
}

export const getSingleUser = async (req: Request, res: Response) => {
	const user = await User.findOne({ _id: req.params.id, role: "user" }).select(
		"-password"
	)
	if (!user) {
		throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`)
	}
	checkPermissions(req.user, user._id)
	res.status(StatusCodes.OK).json({ user })
}

export const showCurrentUser = async (req: Request, res: Response) => {
	res.status(StatusCodes.OK).json({ user: req.user })
}

export const updateUser = async (req: Request, res: Response) => {
	const { email, name } = req.body
	if (!email || !name)
		throw new CustomError.BadRequestError("Please provide both name and email")
	const user = await User.findOneAndUpdate(
		{ _id: req.user.userId },
		{ email, name },
		{
			new: true,
			runValidators: true,
		}
	)
	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.OK).json({ user: tokenUser })
}

export const updateUserPassword = async (req: Request, res: Response) => {
	const { oldPassword, newPassword } = req.body
	if (!oldPassword || !newPassword)
		throw new CustomError.BadRequestError("Please provide both values")
	const user = await User.findOne({ _id: req.user.userId })
	const isPasswordCorrect = await user.comparePassword(oldPassword)
	if (!isPasswordCorrect)
		throw new CustomError.UnauthenticatedError("Invalid Credentials")
	user.password = newPassword
	await user.save()
	res.status(StatusCodes.OK).json({ msg: "Success! Password updated." })
}
