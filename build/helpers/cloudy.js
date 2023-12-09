"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
// uploads photo to the cloudinary
const cloudyName = process.env.CLOUDY_NAME;
const cloudyApi = process.env.CLOUDY_API;
const cloudySecret = process.env.CLOUDY_SECRET;
cloudinary_1.v2.config({
    cloud_name: cloudyName,
    api_key: cloudyApi,
    api_secret: cloudySecret,
});
exports.default = cloudinary_1.v2;
