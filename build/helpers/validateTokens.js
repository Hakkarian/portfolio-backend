"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRefreshToken = exports.validateAccessToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const ErrorHandler_1 = __importDefault(require("./ErrorHandler"));
const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const validateAccessToken = (accessToken) => {
    try {
        if (!accessToken) {
            throw (0, ErrorHandler_1.default)(401);
        }
        const vfiedAccess = jwt.verify(accessToken, accessSecret);
        return vfiedAccess;
    }
    catch (error) {
        return null;
    }
};
exports.validateAccessToken = validateAccessToken;
const validateRefreshToken = (refreshToken) => {
    try {
        if (!refreshToken) {
            console.log('refresh is empty');
            throw (0, ErrorHandler_1.default)(401);
        }
        const vfiedRefresh = jwt.verify(refreshToken, refreshSecret);
        console.log('refresh verified!');
        return vfiedRefresh;
    }
    catch (error) {
        return null;
    }
};
exports.validateRefreshToken = validateRefreshToken;
