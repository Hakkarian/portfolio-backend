"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const cloudyName = process.env.CLOUDY_NAME;
const cloudyApi = process.env.CLOUDY_API;
const cloudySecret = process.env.CLOUDY_SECRET;
cloudinary_1.v2.config({
    cloud_name: "dlw7wjlp3",
    api_key: "824519396937353",
    api_secret: "sAEU2wLub6Gq9Woj8YIiZLKtjpY",
});
exports.default = cloudinary_1.v2;
