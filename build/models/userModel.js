"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        url: {
            type: String
        },
        id: {
            type: String
        }
    },
    token: {
        type: String,
        default: ""
    },
    favorite: [{
            type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Project'
        }],
    verify: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { versionKey: false });
const User = mongoose_1.default.model('User', userSchema, 'users');
exports.default = User;
