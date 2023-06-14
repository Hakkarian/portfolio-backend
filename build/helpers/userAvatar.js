"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAvatar = void 0;
const crypto_1 = __importDefault(require("crypto"));
const gravatar_1 = __importDefault(require("gravatar"));
const userAvatar = (data) => {
    const md5Hash = crypto_1.default.createHash('md5').update(data.trim().toLowerCase()).digest('hex');
    return gravatar_1.default.url(md5Hash, { s: '200', r: 'pg', d: 'identicon' });
};
exports.userAvatar = userAvatar;
