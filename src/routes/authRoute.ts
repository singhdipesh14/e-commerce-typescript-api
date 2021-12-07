import express from "express"
import authRoutes from "../controllers/authController"

const router = express.Router()

const { login, logout, register } = authRoutes

router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)

export default router
