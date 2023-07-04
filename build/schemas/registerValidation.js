"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const regex_1 = require("../regex");
const registerValidation = (data) => {
    const schema = joi_1.default.object({
        username: joi_1.default.string()
            .regex(regex_1.nameRegex)
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
        email: joi_1.default.string().regex(regex_1.emailRegex).email().required().messages({
            "string.empty": `Email cannot be an empty field.`,
            "string.pattern.base": `Email does not support non-Latin chars, digits, trailing or leading.`,
            "any.required": "Email is required.",
        }),
        password: joi_1.default.string()
            .regex(regex_1.passwordRegex)
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
    return schema.validate(data);
};
exports.default = registerValidation;
