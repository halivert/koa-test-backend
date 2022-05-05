import Koa from "koa"
import koaBody from "koa-body"
import { articleRouter } from "./routes/article.mjs"
import { errorHandler } from "./errors/index.mjs"
import cors from "@koa/cors"

const app = new Koa()

app.use(
	cors({
		allowMethods: ["GET", "PUT", "POST", "DELETE"],
	})
)

app.use(errorHandler())

app.use(
	koaBody({
		formidable: { uploadDir: "./uploads" },
		multipart: true,
	})
)

app.use(articleRouter)

export { app }
