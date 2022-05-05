import mongoose from "mongoose"
import { app } from "./app.mjs"

const PORT = 3333

mongoose.connect("mongodb://localhost:27017/blog", {}, () => {
	app.listen(PORT, () => {
		console.log(`Koa server up ${PORT}`)
	})
})
