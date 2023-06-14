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
const schemas_1 = require("../schemas");
const checkLogin = (0, helpers_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, schemas_1.loginValidation)(req.body);
    if (error) {
        throw (0, helpers_1.errorHandler)(400, error.details[0].message);
    }
    const user = models_1.User.findOne({ email: value.email });
    if (error) {
        next((0, helpers_1.errorHandler)(400));
    }
    if (!user) {
        next((0, helpers_1.errorHandler)(401));
    }
    // const correctPassword = await user.checkPassword(value.password, user.password)
    req.body = value;
    next();
}));
exports.default = checkLogin;
