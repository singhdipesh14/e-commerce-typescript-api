import express from "express"
import {
	createOrder,
	getAllOrders,
	updateOrder,
	getSingleOrder,
} from "../controllers/orderController"

import {
	authorizePermissions,
	authenticateUser,
} from "../middleware/authentication"

const router = express.Router()

router
	.route("/")
	.get([authenticateUser, authorizePermissions("admin")], getAllOrders)
	.post([authenticateUser], createOrder)

router
	.route("/:id")
	.patch([authenticateUser], updateOrder)
	.get([authenticateUser], getSingleOrder)

export default router
