import fs from "fs"
import path from "path"
import { Article } from "../models/article.mjs"
import { NotFoundError } from "../errors/index.mjs"
import { validate, Rules } from "../helpers/validate.mjs"

const controller = {
	index: async (ctx) => {
		const { search, date } = ctx.request.query

		if (!search) {
			const articles = await Article.find({})
			return (ctx.body = { articles })
		}

		const dateSort = "desc" === date ? "desc" : "asc"

		const articles = await Article.find({
			$or: [
				{ title: { $regex: search, $options: "i" } },
				{ content: { $regex: search, $options: "i" } },
			],
		}).sort([["date", dateSort]])

		if (!articles.length) {
			throw new NotFoundError("No articles match your search criteria")
		}

		ctx.body = { articles }
	},
	store: async (ctx) => {
		const valid = validate(ctx, {
			title: [Rules.notEmpty],
			content: [Rules.notEmpty],
		})

		const article = new Article(valid)
		await article.save()

		ctx.status = 201
		ctx.body = { article }
	},
	show: async (ctx) => {
		const { id } = ctx.request.params

		let article

		try {
			article = await Article.findById(id)
		} catch (err) {
			throw new NotFoundError("Article not found")
		}

		if (!article) {
			throw new NotFoundError("Article not found")
		}

		ctx.body = { article }
	},
	update: async (ctx) => {
		const { id } = ctx.request.params

		const valid = validate(ctx, {
			title: [Rules.nullable],
			content: [Rules.nullable],
		})

		let article

		try {
			article = await Article.findById(id)
		} catch (err) {
			throw new NotFoundError("Article not found")
		}

		if (!article) throw new NotFoundError("Article not found")

		article.set(valid)
		await article.save()

		ctx.body = { article }
	},
	destroy: async (ctx) => {
		const { id } = ctx.request.params

		try {
			const article = await Article.findById(id)

			if (!article) throw new Error()

			if (article.image) {
				fs.unlinkSync(path.join("uploads", "articles", article.image))
			}

			await article.delete()

			ctx.status = 204
		} catch (err) {
			throw new NotFoundError("Article not found")
		}
	},
}

export { controller as ArticleController }
