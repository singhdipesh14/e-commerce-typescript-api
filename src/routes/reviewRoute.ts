import express from "express"
import {
	createReview,
	getAllReviews,
	getSingleReview,
	updateReview,
	deleteReview,
} from "../controllers/reviewController"

import {
	authorizePermissions,
	authenticateUser,
} from "../middleware/authentication"

const router = express.Router()

router.route("/").get(getAllReviews).post([authenticateUser], createReview)
router
	.route("/:id")
	.get(getSingleReview)
	.patch([authenticateUser], updateReview)
	.delete([authenticateUser], deleteReview)

export default router
