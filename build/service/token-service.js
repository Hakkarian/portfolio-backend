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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const models_1 = require("../models");
const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;
class TokenService {
    constructor() {
        this.validateAccessToken = (accessToken) => {
            try {
                console.log('access accessible', accessToken);
                const userData = jwt.verify(accessToken, accessSecret);
                console.log('01010101');
                console.log('access userDate', userData);
                return userData;
            }
            catch (error) {
                return null;
            }
        };
        this.validateRefreshToken = (refreshToken) => {
            try {
                console.log('refreshToken validate', refreshToken);
                const userData = jwt.verify(refreshToken, refreshSecret);
                console.log('userData validate', userData);
                return userData;
            }
            catch (error) {
                return null;
            }
        };
    }
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, accessSecret, { expiresIn: "1m" });
        const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "15d" });
        return { accessToken, refreshToken };
    }
    saveToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield models_1.Token.findOne({ user: userId });
            if (tokenData) {
                console.log("fixed! new key", refreshToken);
                tokenData.refreshToken = refreshToken;
                return tokenData.save();
            }
            const token = yield models_1.Token.create({ user: userId, refreshToken });
            return token;
        });
    }
    removeToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("logout", refreshToken);
            const tokenData = yield models_1.Token.deleteOne({ refreshToken });
            return tokenData;
        });
    }
    findToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield models_1.Token.findOne({ refreshToken });
            console.log('tokenData', tokenData);
            return tokenData;
        });
    }
}
exports.default = new TokenService();
