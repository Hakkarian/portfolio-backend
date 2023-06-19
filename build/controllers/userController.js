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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const nanoid_1 = require("nanoid");
const helpers_1 = require("../helpers");
const models_1 = require("../models");
const cloudy_1 = __importDefault(require("../helpers/cloudy"));
const baseUrl = process.env.BASE_URL;
const register = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // hashed password
    const salt = 10;
    const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, salt);
    const avatar = (0, helpers_1.userAvatar)(email);
    console.log(avatar);
    const verificationToken = (0, nanoid_1.nanoid)();
    // Create a new user
    const user = yield models_1.User.create({
        username: req.body.username,
        email: req.body.email,
        avatar: { url: avatar, id: "" },
        password: hashedPassword,
    });
    //  const verifyEmail = {
    //    to: req.body.email,
    //    subject: "Verify email",
    //    html: `<a target="_blank" href="${baseUrl}/users/verify/${user.verificationToken}">Click me to verify email</a>`,
    //  };
    //  await sendNodeEmail(verifyEmail);
    res.status(200).json({ message: "User created successfully" });
}));
const login = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ message: "Not Found" });
    }
    const { SECRET_KEY } = process.env;
    const payload = {
        id: user === null || user === void 0 ? void 0 : user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    user.token = token;
    user.save();
    res
        .status(200)
        .json({ token, user: { email: user === null || user === void 0 ? void 0 : user.email, userId: user === null || user === void 0 ? void 0 : user._id } });
}));
const logout = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const user = yield models_1.User.findByIdAndUpdate(_id, { token: "" });
    if (!user) {
        throw (0, helpers_1.ErrorHandler)(401);
    }
    res.status(204).json({ message: "Deleted successfully" });
}));
const current = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { token, username, email, favorite, isAdmin, avatar, _id: userId, } = user;
    res.json({ token, user: { username, email, userId, favorite, isAdmin, avatar } });
}));
const google = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: userId, email, token, username } = req.user;
    res.redirect(`http://localhost:3000?token=${token}&email=${email}&id=${userId}&name=${username}`);
}));
const verifyEmail = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verificationToken } = req.params;
    const user = yield models_1.User.findOne({ verificationToken });
    if (!user) {
        throw (0, helpers_1.ErrorHandler)(404, "Email not found");
    }
    yield models_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
        verify: true,
        verificationToken: null,
    });
    res.status(200).json({ message: "Verification successful" });
}));
const repeatVerifyEmail = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const baseUrl = process.env.BASE_URL;
    const user = yield models_1.User.findOne({ email });
    if (!user) {
        throw (0, helpers_1.ErrorHandler)(401, "Email not found");
    }
    if (user.verify) {
        throw (0, helpers_1.ErrorHandler)(400, "Verification has already been passed");
    }
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${baseUrl}/users/verify/${user.verificationToken}">Click me to verify email</a>`,
    };
    yield (0, helpers_1.sendNodeEmail)(verifyEmail);
    res.json({ message: "Email verification success" });
}));
const updateInfo = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { avatar } = req.user;
    const { username, email } = req.body;
    if (!req.file) {
        const user = yield models_1.User.findByIdAndUpdate(userId, { username,
            email, avatar
        }, { new: true });
        if (!user) {
            throw (0, helpers_1.ErrorHandler)(404, "User not found.");
        }
        return res.status(200).json(user);
    }
    else {
        const userOld = yield models_1.User.findById(userId);
        if (!userOld) {
            throw (0, helpers_1.ErrorHandler)(404, "User not found.");
        }
        const result = yield cloudy_1.default.uploader.upload(req.file.path, {
            public_id: `${(0, nanoid_1.nanoid)()}`,
            folder: "users",
            width: 40,
            height: 40,
            crop: 'fill'
        });
        const user = yield models_1.User.findByIdAndUpdate(userId, {
            username,
            email,
            avatar: { url: result.secure_url, id: result.public_id },
        }, { new: true });
        return res.status(200).json(user);
    }
}));
exports.default = {
    register,
    login,
    logout,
    current,
    google,
    verifyEmail,
    repeatVerifyEmail,
    updateInfo
};
