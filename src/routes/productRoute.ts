import express from "express"
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	uploadImage,
} from "../controllers/productController"

import { getSingleProductReviews } from "../controllers/reviewController"

import {
	authenticateUser,
	authorizePermissions,
} from "../middleware/authentication"

const router = express.Router()

router
	.route("/")
	.get(getAllProducts)
	.post([authenticateUser, authorizePermissions("admin")], createProduct)
router
	.route("/uploadImage")
	.post([authenticateUser, authorizePermissions("admin")], uploadImage)
router
	.route("/:id")
	.get(getSingleProduct)
	.delete([authenticateUser, authorizePermissions("admin")], deleteProduct)
	.patch([authenticateUser, authorizePermissions("admin")], updateProduct)

router.route("/:id/reviews").get(getSingleProductReviews)

export default router
