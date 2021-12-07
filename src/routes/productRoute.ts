import express from "express"
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getSingleProduct,
	updateProduct,
	uploadImage,
} from "../controllers/productController"
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

export default router
