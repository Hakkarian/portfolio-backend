import Joi from "joi"
import { emailRegex } from "../regex"

const emailValidation = (data: any) => {
    const schema = Joi.object({
      email: Joi.string().regex(emailRegex).email().required().messages({
        "string.empty": `Email cannot be an empty field.`,
        "string.pattern.base": `Email not supports non-Latin chars, digits, trailing or leading.`,
        "any.required": "Email is required.",
      }),
    });
    return schema.validate(data)
}

export default emailValidation;