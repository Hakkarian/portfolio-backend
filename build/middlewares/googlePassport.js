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
const passport_1 = __importDefault(require("passport"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = require("jsonwebtoken");
const passport_google_oauth2_1 = require("passport-google-oauth2");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_SECRET;
const jwtSecret = process.env.JWT_SECRET;
const googleParams = {
    clientID: "636271452984-jk4pd8dll23r208dmnh3sutkdin2av9n.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3002/api/google/callback",
    passReqToCallback: true,
};
const googleCallback = (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, displayName, picture } = profile;
        const user = yield models_1.User.findOne({ email });
        if (user) {
            const { _id: userId } = user;
            const token = (0, jsonwebtoken_1.sign)({ userId }, jwtSecret, {
                expiresIn: "24h",
            });
            user.token = token;
            user.save();
            return done(null, user);
        }
        const password = yield bcryptjs_1.default.hash(crypto_1.default.randomBytes(50).toString('base64'), 10);
        const newUser = yield models_1.User.create({ email, password, username: displayName, avatar: picture });
        const { _id: userId } = newUser;
        const token = (0, jsonwebtoken_1.sign)({ userId }, jwtSecret, {
            expiresIn: "24h",
        });
        newUser.save();
        done(null, newUser);
    }
    catch (error) {
        done(error, false);
    }
});
const googleStrategy = new passport_google_oauth2_1.Strategy(googleParams, googleCallback);
passport_1.default.use('google', googleStrategy);
exports.default = passport_1.default;
