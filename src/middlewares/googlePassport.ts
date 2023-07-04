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
const jwtSecret = process.env.SECRET_KEY;
console.log("googleClientId", googleClientId);
console.log("googleSecret", googleSecret);


const googleParams: StrategyOptionsWithRequest = {
  clientID: googleClientId as string,
  clientSecret: googleSecret as string,
  callbackURL: "http://localhost:3002/api/users/google/callback",
  passReqToCallback: true,
};


const googleCallback = async (req: Request, accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    const { email, displayName, picture, sub } = profile;
    console.log('profile', profile);
        const user = await User.findOne({ email });
        if (user) {
          const { _id: userId } = user;
          console.log('secret', jwtSecret)
            const token = sign({ userId }, jwtSecret as string, {
              expiresIn: "24h",
            });
          user.token = token;
          user.save();
          console.log('google user', user);
            return done(null, user)
    }
    const password = await bcryptjs.hash(crypto.randomBytes(50).toString('base64'), 10);
    const avatar = { url: picture, id: "" }
        const newUser = await User.create({
          email,
          username: displayName,
          avatar: avatar,
          location: "Kyiv",
          birthday: "01/01/2001",
          phone: "+380000000000",
          verify: false,
          favorite: []
        });
        const { _id: userId } = newUser;
        const token = sign({ userId }, jwtSecret as string, {
          expiresIn: "24h",
        });
        newUser.token = token;
        newUser.save();
        return done(null, newUser);
    } catch (error) {
        done(error, false);
    }
}

passport.deserializeUser(async function (userId: string, done: any) {
  try {
    const user = await User.findById(userId);
    done(null, user);
  } catch (error) {
    done(error, false)
  }
})

passport.serializeUser(function (user: any, done) {
  done(null, user);
});


const googleStrategy = new GoogleStrategy(googleParams, googleCallback);

passport.use('google', googleStrategy);

export default passport;