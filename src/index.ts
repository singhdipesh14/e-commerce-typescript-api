import express, { Request, Response, Application } from "express"

const app: Application = express()

const port = process.env.PORT || 3000

app.get("/", (req: Request, res: Response) => {
	res.send("hello world")
})

app.listen(port, () => {
	console.log("Listening on port : " + port)
})
