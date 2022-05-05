import mongoose from "mongoose"

const ArticleSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		date: { type: Date, default: Date.now },
		image: { type: String, required: false },
	},
	{
		toJSON: {
			versionKey: false,
			transform(_, ret) {
				ret.id = ret._id
				delete ret._id
			},
		},
	}
)

const Article = mongoose.model("Article", ArticleSchema)

export { Article }
