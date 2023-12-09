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
const jwtSecret = process.env.SECRET_KEY;
// creating a model for google authentication
const googleParams = {
    clientID: googleClientId,
    clientSecret: googleSecret,
    callbackURL: "http://localhost:3002/api/users/google/callback",
    passReqToCallback: true,
};
const googleCallback = (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, displayName, picture } = profile;
        // retrieving information about google profile
        // find the user with found email
        // if such user exists, pass a token to him, and save the user in the database
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
        // if the user doesn't exist, create credentials and avatar based on the google profile
        const password = yield bcryptjs_1.default.hash(crypto_1.default.randomBytes(50).toString("base64"), 10);
        const avatar = { url: picture, id: "" };
        const newUser = yield models_1.User.create({
            email,
            username: displayName,
            avatar: avatar,
            location: "Kyiv",
            birthday: "01/01/2001",
            phone: "+380000000000",
            verify: false,
            favorite: [],
        });
        const { _id: userId } = newUser;
        // along with token, which is passed directly to new user
        const token = (0, jsonwebtoken_1.sign)({ userId }, jwtSecret, {
            expiresIn: "24h",
        });
        newUser.token = token;
        // save him in the database
        newUser.save();
        return done(null, newUser);
    }
    catch (error) {
        done(error, false);
    }
});
// convert user object that it can be stored in the session
passport_1.default.deserializeUser(function (userId, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield models_1.User.findById(userId);
            done(null, user);
        }
        catch (error) {
            done(error, false);
        }
    });
});
// retrieve full user object from the database
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
// authenticate using google credentials
const googleStrategy = new passport_google_oauth2_1.Strategy(googleParams, googleCallback);
// configure Passport.js to work with google authentication
passport_1.default.use('google', googleStrategy);
exports.default = passport_1.default;
