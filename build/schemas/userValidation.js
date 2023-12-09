"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const regex_1 = require("../regex");
const userValidation = (data) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string()
            .regex(regex_1.nameRegex)
            .min(4)
            .max(16)
            .messages({
            "string.empty": `Name cannot be an empty field.`,
            "string.pattern.base": `Name must contain alphanumeric, numbers and underscores only.`,
            "string.min": `Name should have minimum length of 4.`,
            "string.max": `Name should have maximum length of 16.`,
        }),
        email: joi_1.default.string().regex(regex_1.emailRegex).email().required().messages({
            "string.empty": `Email cannot be an empty field.`,
            "string.pattern.base": `Email not supports non-Latin chars, digits, trailing or leading.`,
            "any.required": "Email is required.",
        }),
        birthday: joi_1.default.string().regex(regex_1.birthdayRegex).messages({
            "string.empty": `Birthday cannot be an empty field.`,
            "string.pattern.base": `Birthday must match the format 01/01/2023 or 01-01-2023`,
        }),
        location: joi_1.default.string().regex(regex_1.locationRegex).messages({
            "string.empty": `Location cannot be an empty field.`,
            "string.pattern.base": `Example of right location: Schevchenka Street, 123`,
        }),
        phone: joi_1.default.string().regex(regex_1.phoneRegex).messages({
            "string.empty": `Birthday cannot be an empty field.`,
            "string.pattern.base": `Number must match the format +380XXXXXXXXX or 0XXXXXXXXX`,
        }),
    });
    return schema.validate(data);
};
exports.default = userValidation;
