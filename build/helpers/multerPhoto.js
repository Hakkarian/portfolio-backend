"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const nanoid_1 = require("nanoid");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/images");
    },
    filename: (req, file, cb) => {
        cb(null, `${(0, nanoid_1.nanoid)()}__${file.originalname}`);
    }
});
exports.upload = (0, multer_1.default)({ storage });
