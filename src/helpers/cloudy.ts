import { v2 as cloudinary } from 'cloudinary';

// uploads photo to the cloudinary
const cloudyName = process.env.CLOUDY_NAME;
const cloudyApi = process.env.CLOUDY_API;
const cloudySecret = process.env.CLOUDY_SECRET;

cloudinary.config({
  cloud_name: cloudyName,
  api_key: cloudyApi,
  api_secret: cloudySecret,
});

export default cloudinary;