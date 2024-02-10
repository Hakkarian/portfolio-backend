"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const helpers_1 = require("../helpers");
const models_1 = require("../models");
const _1 = require(".");
const userDto_1 = __importDefault(require("../dtos/userDto"));
class UserService {
    registration(username, email, password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = yield models_1.User.findOne({ email });
            if (candidate) {
                throw (0, helpers_1.ErrorHandler)(401, 'User with same email already exist');
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
            const avatar = (0, helpers_1.userAvatar)(email);
            const user = yield models_1.User.create({
                username: username,
                email: email,
                password: hashedPassword,
                token: "",
                birthday: "",
                location: "",
                phone: "",
                avatar: { url: avatar, id: "" },
            });
            const payload = {
                id: user === null || user === void 0 ? void 0 : user._id,
                email: user === null || user === void 0 ? void 0 : user.email,
                verify: user === null || user === void 0 ? void 0 : user.verify,
            };
            const tokens = _1.TokenService.generateTokens(payload);
            yield _1.TokenService.saveToken(payload.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user });
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findOne({ email });
            if (!user) {
                throw (0, helpers_1.ErrorHandler)(401, "User does not exist");
            }
            const isPassEquals = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPassEquals) {
                throw (0, helpers_1.ErrorHandler)(401, "Password is wrong");
            }
            const userDto = new userDto_1.default(user);
            const payload = {
                id: user === null || user === void 0 ? void 0 : user._id,
                username: user === null || user === void 0 ? void 0 : user.username,
                email: user === null || user === void 0 ? void 0 : user.email,
                verify: user === null || user === void 0 ? void 0 : user.verify,
                avatar: user === null || user === void 0 ? void 0 : user.avatar
            };
            const tokens = _1.TokenService.generateTokens(payload);
            yield _1.TokenService.saveToken(payload.id, tokens.refreshToken);
            return Object.assign(Object.assign({}, tokens), { user });
        });
    }
    logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield _1.TokenService.removeToken(refreshToken);
            return token;
        });
    }
    refresh(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw (0, helpers_1.ErrorHandler)(401);
            }
            const userData = _1.TokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = yield _1.TokenService.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                throw (0, helpers_1.ErrorHandler)(401);
            }
            const user = yield models_1.User.findById(userData.id);
            const payload = {
                id: user === null || user === void 0 ? void 0 : user._id,
                username: user === null || user === void 0 ? void 0 : user.username,
                email: user === null || user === void 0 ? void 0 : user.email,
                verify: user === null || user === void 0 ? void 0 : user.verify,
                avatar: user === null || user === void 0 ? void 0 : user.avatar,
            };
            const tokens = _1.TokenService.generateTokens(payload);
            return Object.assign(Object.assign({}, tokens), { user });
        });
    }
}
exports.default = new UserService();
