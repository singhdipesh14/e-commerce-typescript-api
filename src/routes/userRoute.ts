import express from "express"
import { getCurrentUserOrders } from "../controllers/orderController"
import {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
} from "../controllers/userController"

import {
	authorizePermissions,
	authenticateUser,
} from "../middleware/authentication"

const router = express.Router()

router
	.route("/")
	.get(authenticateUser, authorizePermissions("admin"), getAllUsers)

router.route("/showMe").get(authenticateUser, showCurrentUser)

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders)

router.route("/updateUser").patch(authenticateUser, updateUser)

router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword)

router.route("/:id").get(authenticateUser, getSingleUser)

export default router
