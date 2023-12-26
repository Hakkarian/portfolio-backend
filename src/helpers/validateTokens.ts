import * as jwt from "jsonwebtoken"
import ErrorHandler from "./ErrorHandler";

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

const validateAccessToken = (accessToken: string) => {
    try {
        if (!accessToken ) {
            throw ErrorHandler(401);
        }
        const vfiedAccess = jwt.verify(accessToken, accessSecret)
        return vfiedAccess;
    } catch (error) {
        return null;
    }
}

const validateRefreshToken = (refreshToken: string) => {
  try {
      if (!refreshToken) {
        console.log('refresh is empty')
      throw ErrorHandler(401);
    }
    console.log('snap')
      const vfiedRefresh = jwt.verify(refreshToken, refreshSecret);
      console.log('refresh verified!')
    return vfiedRefresh;
  } catch (error) {
    console.log(error);
  }
};

export {validateAccessToken, validateRefreshToken};