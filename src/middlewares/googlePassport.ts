import passport from 'passport';
import crypto from 'crypto';
import { sign } from "jsonwebtoken";
import { Strategy as GoogleStrategy, StrategyOptionsWithRequest} from 'passport-google-oauth2';
import { Request } from 'express';
import bcryptjs from 'bcryptjs';


import { User } from '../models';
import { StrategyOptions } from 'passport-google-oauth2';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_SECRET;
const jwtSecret = process.env.JWT_SECRET;


const googleParams: StrategyOptionsWithRequest = {
  clientID:
    "636271452984-jk4pd8dll23r208dmnh3sutkdin2av9n.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:3002/api/google/callback",
  passReqToCallback: true,
};

const googleCallback = async (req: Request, accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
        const { email, displayName, picture } = profile;
        const user = await User.findOne({ email });
        if (user) {
            const { _id: userId } = user;
            const token = sign({ userId }, jwtSecret as string, {
              expiresIn: "24h",
            });
            user.token = token;
            user.save();
            return done(null, user)
        }
        const password = await bcryptjs.hash(crypto.randomBytes(50).toString('base64'), 10);
        const newUser = await User.create({ email, password, username: displayName, avatar: picture });
        const { _id: userId } = newUser;
        const token = sign({ userId }, jwtSecret as string, {
          expiresIn: "24h",
        });
        newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false);
    }
}

const googleStrategy = new GoogleStrategy(googleParams, googleCallback);

passport.use('google', googleStrategy);

export default passport;