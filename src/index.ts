import express, { Request, Response, Application, NextFunction } from "express" // express
import dotenv from "dotenv" // env variables
import connectDB from "./db/connect" // database
import "express-async-errors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import { v2 as cloudinary } from "cloudinary"

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

// applying middlewares
app.use(morgan("tiny"))
app.use(express.json())
// can be anything, not necessarily JWT_SECRET
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static("./public"))
app.use(fileUpload({ useTempFiles: true }))

app.get("/", (req: Request, res: Response) => {
	res.send("hello world")
})

app.get("/api/v1", (req: Request, res: Response) => {
	console.log(req.signedCookies)
	res.send("e-commerce-api")
})

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
