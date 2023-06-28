import Joi from "joi"
import { birthdayRegex, emailRegex, locationRegex, nameRegex, phoneRegex } from "../regex";

const userValidation = () => {
    const schema = Joi.object({
      username: Joi.string()
        .regex(nameRegex)
        .min(4)
        .max(16)
        .messages({
          "string.empty": `Name cannot be an empty field.`,
          "string.pattern.base": `Name must contain alphanumeric, numbers and underscores only.`,
          "string.min": `Name should have minimum length of 4.`,
          "string.max": `Name should have maximum length of 16.`,
        }),
      email: Joi.string().regex(emailRegex).email().required().messages({
        "string.empty": `Email cannot be an empty field.`,
        "string.pattern.base": `Email not supports non-Latin chars, digits, trailing or leading.`,
        "any.required": "Email is required.",
      }),
      birthday: Joi.string().regex(birthdayRegex).messages({
        "string.empty": `Birthday cannot be an empty field.`,
        "string.pattern.base": `Birthday must match the format 01/01/2023 or 01-01-2023`,
      }),
      location: Joi.string().regex(locationRegex).messages({
        "string.empty": `Location cannot be an empty field.`,
        "string.pattern.base": `Example of right location: Schevchenka Street, 123`,
      }),
      phone: Joi.string().regex(phoneRegex).messages({
        "string.empty": `Birthday cannot be an empty field.`,
        "string.pattern.base": `Number must match the format +380XXXXXXXXX or 0XXXXXXXXX`,
      }),
    });
}