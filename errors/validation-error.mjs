export class ValidationError extends Error {
	constructor(message, field) {
		super(message)
		this.status = 400
		this.body = {
			message,
			field,
		}
	}
}
