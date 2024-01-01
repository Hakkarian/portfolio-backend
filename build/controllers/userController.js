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
const fs_1 = __importDefault(require("fs"));
const nanoid_1 = require("nanoid");
const helpers_1 = require("../helpers");
const models_1 = require("../models");
const cloudy_1 = __importDefault(require("../helpers/cloudy"));
const service_1 = require("../service");
const baseUrl = process.env.BASE_URL;
// create a user with default avatar and credentials
const register = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    console.log('1');
    // hashed password
    const salt = 10;
    // Create a new user
    const userData = yield service_1.UserService.registration(username, email, password, salt);
    console.log('2');
    res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000 });
    res.status(200).json(userData);
}));
// user must login after registration. If such user is not present, throw an error, save them to database, and add them a token
const login = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('login');
    const { email, password } = req.body;
    console.log('email');
    const userData = yield service_1.UserService.login(email, password);
    console.log('yea', userData);
    res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json(userData);
}));
// on logout user's token is removed from database.
const logout = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const token = service_1.UserService.logout(refreshToken);
    console.log('clear 2');
    res.clearCookie("refreshToken");
    console.log('clear 3');
    res.status(200).json({ message: "Deleted successfully", token });
}));
// user will be constantly saved between reloads
const refresh = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const userData = yield service_1.UserService.refresh(refreshToken);
    console.log('refresh data', userData);
    console.log('auth header', req.headers.authorization);
    res.status(200).json(userData);
}));
// google authentication. All credentials were passed via the link
const google = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: userId, email, token, username, avatar, location, birthday, phone, } = req.user;
    res.redirect(`http://localhost:3000?token=${token}&email=${email}&userId=${userId}&username=${username}&url=${avatar.url}&avatarId=${avatar.id}&location=${location}&birthday=${birthday}&phone=${phone}`);
}));
// find a user ith verification Token. If such isn't there, throw an error
// else succesfully verified
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
// if somehow user is not able to see email verification, it is repeated
// if user is already verified, throw an error
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
// update the information about user, his credentials and photo
const updateInfo = (0, helpers_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { avatar, token } = req.user;
    const { username, email, location, birthday, phone } = req.body;
    if (!req.file) {
        const user = yield models_1.User.findByIdAndUpdate(userId, { username, email, location, birthday, phone, avatar }, { new: true });
        if (!user) {
            throw (0, helpers_1.ErrorHandler)(404, "User not found.");
        }
        // updates not only user's credentials, but also information inside of the comment
        yield models_1.Comment.updateMany({ "author.userId": userId }, {
            "author.username": username,
            "author.location": location,
            "author.email": email,
            "author.phone": phone,
        }, { new: true });
        return res.status(200).json({
            username: user === null || user === void 0 ? void 0 : user.username,
            email: user === null || user === void 0 ? void 0 : user.email,
            location: user === null || user === void 0 ? void 0 : user.location,
            birthday: user === null || user === void 0 ? void 0 : user.birthday,
            phone: user === null || user === void 0 ? void 0 : user.phone,
            userId: user === null || user === void 0 ? void 0 : user._id,
            favorite: user === null || user === void 0 ? void 0 : user.favorite,
            avatar: user === null || user === void 0 ? void 0 : user.avatar,
        });
    }
    else {
        const userOld = yield models_1.User.findById(userId);
        if (!userOld) {
            throw (0, helpers_1.ErrorHandler)(404, "User not found.");
        }
        if (userOld.avatar.id) {
            yield cloudy_1.default.uploader.destroy(userOld.avatar.id);
        }
        const result = yield cloudy_1.default.uploader.upload(req.file.path, {
            public_id: `${(0, nanoid_1.nanoid)()}`,
            folder: "users",
            width: 40,
            height: 40,
            crop: "fill",
            gravity: "auto",
        });
        console.log(req.file.path);
        fs_1.default.unlink(req.file.path, (error) => console.log(error));
        const avatar = { url: result.secure_url, id: result.public_id };
        const user = yield models_1.User.findByIdAndUpdate(userId, {
            username,
            email,
            birthday,
            location,
            phone,
            avatar,
        }, { new: true });
        // updates with avatar
        yield models_1.Comment.updateMany({ "author.userId": userId }, {
            "author.username": username,
            "author.location": location,
            "author.email": email,
            "author.phone": phone,
            "author.avatar.url": result.secure_url,
            "author.avatar.id": result.public_id,
        }, { new: true });
        return res.status(200).json({
            username: user === null || user === void 0 ? void 0 : user.username,
            email: user === null || user === void 0 ? void 0 : user.email,
            location: user === null || user === void 0 ? void 0 : user.location,
            birthday: user === null || user === void 0 ? void 0 : user.birthday,
            phone: user === null || user === void 0 ? void 0 : user.phone,
            userId: user === null || user === void 0 ? void 0 : user._id,
            favorite: user === null || user === void 0 ? void 0 : user.favorite,
            avatar: user === null || user === void 0 ? void 0 : user.avatar,
        });
    }
}));
exports.default = {
    register,
    login,
    logout,
    refresh,
    google,
    verifyEmail,
    repeatVerifyEmail,
    updateInfo,
};
