import { v2 as cloudinary } from 'cloudinary';

console.log(process.env.CLOUDY_API)

const cloudyName = process.env.CLOUDY_NAME;
const cloudyApi = process.env.CLOUDY_API;
const cloudySecret = process.env.CLOUDY_SECRET;

cloudinary.config({
  cloud_name: "dlw7wjlp3",
  api_key: "824519396937353",
    api_secret: "sAEU2wLub6Gq9Woj8YIiZLKtjpY",
});

export default cloudinary;