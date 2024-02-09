import * as jwt from "jsonwebtoken";
import { catchAsync } from "../helpers";
import { Token } from "../models";

const accessSecret = process.env.JWT_ACCESS_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;

class TokenService {
    generateTokens(payload: any) {
      const accessToken = jwt.sign(payload, accessSecret, { expiresIn: "1m" });
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "15d" });
    return { accessToken, refreshToken };
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      console.log("fixed! new key", refreshToken);
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({ user: userId, refreshToken });
    return token;
    }
    
  

  async removeToken(refreshToken: string) {
    console.log("logout", refreshToken);
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  }
    async findToken(refreshToken: string) {
      const tokenData = await Token.findOne({ refreshToken });
      console.log('tokenData', tokenData);
        return tokenData;
    }
  validateAccessToken = (accessToken: string) => {
    try {
      console.log('access accessible', accessToken)
      const userData = jwt.verify(accessToken, accessSecret);
      console.log('01010101')
      console.log('access userDate', userData)
      return userData;
    } catch (error: any) {
      return null;
    }
  };

  validateRefreshToken = (refreshToken: string) => {
    try {
      console.log('refreshToken validate', refreshToken);
      const userData = jwt.verify(refreshToken, refreshSecret);
      console.log('userData validate', userData);
      return userData;
    } catch (error) {
      return null;
    }
  };
}

export default new TokenService();