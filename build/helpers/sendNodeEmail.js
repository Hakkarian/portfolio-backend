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
exports.emailKey = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.emailKey = process.env.META_PASSWORD;
// handles email transfer
const nodemailerConfig = {
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
        user: 'theobadar@meta.ua',
        pass: exports.emailKey
    },
};
// creates transport, by which some information will be transferred
const transport = nodemailer_1.default.createTransport(nodemailerConfig);
const sendNodeEmail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield transport
        .sendMail(Object.assign(Object.assign({}, data), { from: "theobadar@meta.ua" }))
        .then(() => console.log("Success nodemail"))
        // if data is not transferred correctly, throw an error
        .catch((error) => console.log("email", error.message));
    // else exit the operation
    return true;
});
exports.default = sendNodeEmail;
