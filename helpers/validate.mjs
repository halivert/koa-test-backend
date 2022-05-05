import validator from "validator"
import { ValidationError } from "../errors/validation-error.mjs"

export const validate = (ctx, rules) => {
	const valid = Object.entries(rules).map(([name, ruleSet]) => {
		const data = ctx.request.body[name]

		ruleSet.forEach((rule) => {
			let result = rule(data, name)
			if (result) throw new ValidationError(result, name)
		})

		return data ? [name, data] : null
	})

	return Object.fromEntries(valid.filter((e) => e))
}

export const Rules = {
	notEmpty: (data, field) => {
		return !data || validator.isEmpty(data) ? `${field} is required` : false
	},
	nullable: (_data, _field) => false,
}
