import express, { Request, Response, Application, NextFunction } from "express" // express
import dotenv from "dotenv" // env variables
import connectDB from "./db/connect" // database
import "express-async-errors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"

// middlewares
import notFoundMiddleware from "./middleware/not-found"
import errorHandlerMiddleware from "./middleware/error-handler"

// routers
import authRouter from "./routes/authRoute"
import userRouter from "./routes/userRoute"
import productRouter from "./routes/productRoute"

// configurations
dotenv.config()
const app: Application = express()
const port = process.env.PORT || 3000

// applying middlewares
app.use(morgan("tiny"))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static("./public"))
app.use(fileUpload())

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
