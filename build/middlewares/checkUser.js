"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const schemas_1 = require("../schemas");
const checkUser = (0, helpers_1.catchAsync)((req, res, next) => {
    const { error, value } = (0, schemas_1.userValidation)(req.body);
    if (error) {
        next((0, helpers_1.ErrorHandler)(400, error.message));
    }
    req.body = value;
    next();
});
exports.default = checkUser;
