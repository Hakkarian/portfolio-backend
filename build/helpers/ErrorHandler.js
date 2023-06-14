"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
const errorMessages = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict"
};
const errorHandler = (status, message = errorMessages[status]) => {
    const error = new CustomError(status, message);
    error.status = status;
    return error;
};
exports.default = errorHandler;
