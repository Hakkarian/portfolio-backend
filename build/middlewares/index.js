"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkRegister_1 = __importDefault(require("./checkRegister"));
const checkLogin_1 = __importDefault(require("./checkLogin"));
const authenticate_1 = __importDefault(require("./authenticate"));
const checkEmail_1 = __importDefault(require("./checkEmail"));
const isValidId_1 = __importDefault(require("./isValidId"));
const isAdmin_1 = __importDefault(require("./isAdmin"));
exports.default = { checkRegister: checkRegister_1.default, checkLogin: checkLogin_1.default, authenticate: authenticate_1.default, checkEmail: checkEmail_1.default, isValidId: isValidId_1.default, isAdmin: isAdmin_1.default };
