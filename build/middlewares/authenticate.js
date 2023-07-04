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
    const authorization = (_a = req.headers.authorization) !== null && _a !== void 0 ? _a : "";
    console.log('here auth', authorization);
    const secret = process.env.SECRET_KEY;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        console.log("authenticate error bearer");
        next((0, helpers_1.ErrorHandler)(401));
    }
    try {
        const { userId: id } = jsonwebtoken_1.default.verify(token, secret);
        if (!id) {
            console.log('id error');
            throw (0, helpers_1.ErrorHandler)(401);
        }
        const user = yield models_1.User.findById(id);
        if (!user || !user.token || user.token !== token) {
            console.log('authenticate error smth with user');
            throw (0, helpers_1.ErrorHandler)(401);
        }
        req.user = user;
        next();
    }
    catch (error) {
        next((0, helpers_1.ErrorHandler)(401));
    }
});
exports.default = authenticate;
