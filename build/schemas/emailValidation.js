"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const regex_1 = require("../regex");
const emailValidation = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().regex(regex_1.emailRegex).email().required().messages({
            "string.empty": `Email cannot be an empty field.`,
            "string.pattern.base": `Email not supports non-Latin chars, digits, trailing or leading.`,
            "any.required": "Email is required.",
        }),
    });
    return schema.validate(data);
};
exports.default = emailValidation;
