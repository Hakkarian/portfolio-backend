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
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const models_1 = require("../models");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // check for authorization token
    const authorization = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : "";
    // split the token into two parts - bearer and token
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        next((0, helpers_1.ErrorHandler)(401));
    }
    try {
        const { refreshToken } = req.cookies;
        console.log('ahahahaha', req.cookies);
        const vfiedRefresh = (0, helpers_1.validateRefreshToken)(refreshToken);
        if (!vfiedRefresh) {
            console.log("last refresh verification is wrong");
            throw (0, helpers_1.ErrorHandler)(401);
        }
        // if the token is correct, find user by this id
        // if user undefined, if user's token isn't there or does not equal to token which is passed - throw an error
        const user = yield models_1.User.findById(vfiedRefresh === null || vfiedRefresh === void 0 ? void 0 : vfiedRefresh.id);
        console.log('refresh user contents', user);
        // else user is passed into the slot, continue
        req.user = user;
        console.log('deus ex machina');
        next();
    }
    catch (error) {
        next((0, helpers_1.ErrorHandler)(401));
    }
});
exports.default = authenticate;
