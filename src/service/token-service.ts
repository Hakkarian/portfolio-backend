import * as jwt from "jsonwebtoken";
import { catchAsync } from "../helpers";
import { Token } from "../models";

const secret = process.env.JWT_ACCESS_SECRET!;
const secrete = process.env.JWT_REFRESH_SECRET!;

const generateTokens = (payload: any) => {
    const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' })
    const refreshToken = jwt.sign(payload, secrete, { expiresIn: "15d" });
    return {accessToken, refreshToken}
}

const saveTokens = async (userId: string, refreshToken: string) => {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }
    const token = await Token.create({ user: userId, refreshToken })
    return token;
};

export {generateTokens, saveTokens}