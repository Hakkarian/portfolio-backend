"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimitter = exports.registerLimitter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.registerLimitter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 2,
    message: {
        message: "Too many requests, please try again later.",
    },
});
exports.loginLimitter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many requests, please try again later.",
    },
});
