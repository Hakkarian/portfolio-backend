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
const service_1 = require("../service");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next((0, helpers_1.ErrorHandler)(401, "One error"));
        }
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next((0, helpers_1.ErrorHandler)(404, "Two error"));
        }
        const userData = service_1.TokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next((0, helpers_1.ErrorHandler)(401, "Token expired"));
        }
        req.user = userData;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.default = authenticate;
