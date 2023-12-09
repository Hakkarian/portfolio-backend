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
const helpers_1 = require("../helpers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // check for authorization token
    const authorization = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : "";
    const secret = process.env.SECRET_KEY;
    // split the token into two parts - bearer and token
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        next((0, helpers_1.ErrorHandler)(401));
    }
    try {
        // verify if token is correct
        // if not, throw an error
        const { userId: id } = jsonwebtoken_1.default.verify(token, secret);
        if (!id) {
            throw (0, helpers_1.ErrorHandler)(401);
        }
        // if the token is correct, find user by this id
        // if user undefined, if user's token isn't there or does not equal to token which is passed - throw an error
        const user = yield models_1.User.findById(id);
        if (!user || !user.token || user.token !== token) {
            throw (0, helpers_1.ErrorHandler)(401);
        }
        // else user is passed into the slot, continue
        req.user = user;
        next();
    }
    catch (error) {
        next((0, helpers_1.ErrorHandler)(401));
    }
});
exports.default = authenticate;
