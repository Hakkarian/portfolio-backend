import Joi from "joi"
import { emailRegex, passwordRegex } from "../regex"

interface User {
  email: string;
  password: string;
}

// check if email and password align with the standard

const loginValidation = (data: User) => {
  const schema = Joi.object({
    email: Joi.string().regex(emailRegex).email().required().messages({
      "string.empty": `Email cannot be an empty field.`,
      "string.pattern.base": `Email not supports non-Latin chars, digits, trailing or leading.`,
      "any.required": "Email is required.",
    }),
    password: Joi.string()
      .regex(passwordRegex)
      .min(8)
      .max(16)
      .required()
      .messages({
        "string.empty": `Password cannot be an empty field.`,
        "string.pattern.base": `Password must be more than 8 chars, must have at least 1 number and at least 1 special character.`,
        "string.min": `Password should have minimum length of 8.`,
        "string.max": `Password should have maximum length of 16.`,
        "any.required": "Password is required.",
      }),
  });
  return schema.validate(data);
};

export default loginValidation;