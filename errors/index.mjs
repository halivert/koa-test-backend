export * from "./not-found-error.mjs"
export * from "./validation-error.mjs"

export const errorHandler =
	(opts = { err: { status: "status", body: "body" } }) =>
	async (ctx, next) => {
		try {
			await next()
		} catch (err) {
			ctx.status = err[opts.err.status] ?? 500
			ctx.body = err[opts.err.body] ?? {
				message: err.message,
			}
		}
	}
