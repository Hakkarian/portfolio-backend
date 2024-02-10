"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDto {
    constructor(model) {
        this.email = model.email;
        this.userId = model._id;
        this.verify = model.verify;
    }
}
exports.default = UserDto;
