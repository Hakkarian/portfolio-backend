"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const regex_1 = require("../regex");
// check if email and password align with the standard
const loginValidation = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().regex(regex_1.emailRegex).email().required().messages({
            "string.empty": `Email cannot be an empty field.`,
            "string.pattern.base": `Email not supports non-Latin chars, digits, trailing or leading.`,
            "any.required": "Email is required.",
        }),
        password: joi_1.default.string()
            .regex(regex_1.passwordRegex)
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
exports.default = loginValidation;
