import express, { Request, Response, Application, NextFunction } from "express" // express
import dotenv from "dotenv" // env variables
import connectDB from "./db/connect" // database
import "express-async-errors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import { v2 as cloudinary } from "cloudinary"
import rateLimiter from "express-rate-limit"
import helmet from "helmet"
import xss from "xss-clean"
import cors from "cors"
import ExpressMongoSanitize from "express-mongo-sanitize"

// middlewares
import notFoundMiddleware from "./middleware/notFound"
import errorHandlerMiddleware from "./middleware/errorHandler"

// routers
import authRouter from "./routes/authRoute"
import userRouter from "./routes/userRoute"
import productRouter from "./routes/productRoute"
import reviewRouter from "./routes/reviewRoute"
import orderRouter from "./routes/orderRoute"

// configurations
dotenv.config()
const app: Application = express()
const port = process.env.PORT || 3000

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
})

//security
app.set("trust proxy", 1)
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 60,
	})
)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(ExpressMongoSanitize())

// applying middlewares
app.use(morgan("tiny"))
app.use(express.json())
// can be anything, not necessarily JWT_SECRET
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static("public"))
app.use(fileUpload({ useTempFiles: true }))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/orders", orderRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
	try {
		await connectDB(process.env.MONGO_DB_URI || "")
		app.listen(port, () => console.log(`Server is listening on port ${port}...`))
	} catch (error) {
		console.log(error)
	}
}

start()
