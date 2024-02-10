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
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await Token.create({ user: userId, refreshToken });
    return token;
    }
    
  

  async removeToken(refreshToken: string) {
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  }
    async findToken(refreshToken: string) {
      const tokenData = await Token.findOne({ refreshToken });

        return tokenData;
    }
  validateAccessToken = (accessToken: string) => {
    try {
      const userData = jwt.verify(accessToken, accessSecret);
      return userData;
    } catch (error: any) {
      return null;
    }
  };

  validateRefreshToken = (refreshToken: string) => {
    try {
      const userData = jwt.verify(refreshToken, refreshSecret);
      return userData;
    } catch (error) {
      return null;
    }
  };
}

export default new TokenService();