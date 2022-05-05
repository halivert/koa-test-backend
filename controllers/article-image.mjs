import fs from "fs"
import path from "path"
import mime from "mime-types"
import { Article } from "../models/article.mjs"
import { ValidationError, NotFoundError } from "../errors/index.mjs"

const controller = {
	store: async (ctx) => {
		const { file } = ctx.request.files
		const { id } = ctx.request.params

		if (!file)
			throw new ValidationError(
				"file must be provided and a valid file",
				"file"
			)

		let filePath = file.path

		try {
			if (!new RegExp("image/.*").test(file.type)) {
				throw new ValidationError("file must be an image", "file")
			}

			const ext = path.extname(file.name)
			const article = await Article.findById(id)

			if (!article) throw new NotFoundError("Article not found")

			if (article.image) {
				fs.unlinkSync(path.join("uploads", "articles", article.image))
			}

			filePath = path.join(
				path.dirname(filePath),
				"articles",
				path.basename(filePath) + ext
			)

			fs.renameSync(file.path, filePath)

			article.set({ image: path.basename(filePath) })
			await article.save()

			ctx.body = { article }
		} catch (err) {
			fs.unlinkSync(filePath)
			throw err
		}
	},
	get: async (ctx) => {
		const { id } = ctx.request.params

		try {
			const article = await Article.findById(id)

			if (!article) throw new NotFoundError("Article not found")

			if (!article.image) throw new NotFoundError("Article has no image")

			const filePath = path.join("uploads", "articles", article.image)

			ctx.type = mime.lookup(filePath)
			ctx.body = fs.readFileSync(filePath)
		} catch (err) {
			throw new NotFoundError("Article or image not found")
		}
	},
}

export { controller as ArticleImageController }
