import Joi from "joi"
import { emailRegex, nameRegex, passwordRegex } from "../regex";

interface User {
    username: string,
    email: string,
    password: string
}

const registerValidation = (data: User) => {
    const schema = Joi.object({
      username: Joi.string()
        .regex(nameRegex)
        .min(4)
        .max(16)
        .required()
        .messages({
          "string.empty": `Name cannot be an empty field.`,
          "string.pattern.base": `Name must contain alphanumeric, numbers and underscores only.`,
          "string.min": `Name should have minimum length of 4.`,
          "string.max": `Name should have maximum length of 16.`,
          "any.required": "Name is required.",
        }),
      email: Joi.string().regex(emailRegex).email().required().messages({
        "string.empty": `Email cannot be an empty field.`,
        "string.pattern.base": `Email does not support non-Latin chars, digits, trailing or leading.`,
        "any.required": "Email is required.",
      }),
      password: Joi.string()
        .regex(passwordRegex)
        .min(8)
        .max(16)
        .required()
        .messages({
          "string.empty": `Password cannot be an empty field.`,
          "string.pattern.base": `Password must be more than 8 chars, must have at least 1 number, 1 special character and 1 uppercase letter.`,
          "string.min": `Password should have minimum length of 8.`,
          "string.max": `Password should have maximum length of 16.`,
          "any.required": "Password is required.",
        }),
    });
    return schema.validate(data)
}



export default registerValidation;