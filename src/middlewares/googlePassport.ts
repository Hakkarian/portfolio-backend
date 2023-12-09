import passport from 'passport';
import crypto from 'crypto';
import { sign } from "jsonwebtoken";
import { Strategy as GoogleStrategy, StrategyOptionsWithRequest} from 'passport-google-oauth2';
import { Request } from 'express';
import bcryptjs from 'bcryptjs';


import { User } from '../models';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_SECRET;
const jwtSecret = process.env.SECRET_KEY;

// creating a model for google authentication

const googleParams: StrategyOptionsWithRequest = {
  clientID: googleClientId as string,
  clientSecret: googleSecret as string,
  callbackURL: "http://localhost:3002/api/users/google/callback",
  passReqToCallback: true,
};


const googleCallback = async (req: Request, accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    const { email, displayName, picture } = profile;
    // retrieving information about google profile
    // find the user with found email
    // if such user exists, pass a token to him, and save the user in the database
    const user = await User.findOne({ email });
    if (user) {
      const { _id: userId } = user;
      const token = sign({ userId }, jwtSecret as string, {
        expiresIn: "24h",
      });
      user.token = token;
      user.save();
      return done(null, user);
    }
    // if the user doesn't exist, create credentials and avatar based on the google profile
    const password = await bcryptjs.hash(
      crypto.randomBytes(50).toString("base64"),
      10
    );
    const avatar = { url: picture, id: "" };
    const newUser = await User.create({
      email,
      username: displayName,
      avatar: avatar,
      location: "Kyiv",
      birthday: "01/01/2001",
      phone: "+380000000000",
      verify: false,
      favorite: [],
    });
    const { _id: userId } = newUser;
    // along with token, which is passed directly to new user
    const token = sign({ userId }, jwtSecret as string, {
      expiresIn: "24h",
    });
    newUser.token = token;
    // save him in the database
    newUser.save();
    return done(null, newUser);
  } catch (error) {
        done(error, false);
    }
}

// convert user object that it can be stored in the session

passport.deserializeUser(async function (userId: string, done: any) {
  try {
    const user = await User.findById(userId);
    done(null, user);
  } catch (error) {
    done(error, false)
  }
})

// retrieve full user object from the database
passport.serializeUser(function (user: any, done) {
  done(null, user);
});

// authenticate using google credentials
const googleStrategy = new GoogleStrategy(googleParams, googleCallback);

// configure Passport.js to work with google authentication
passport.use('google', googleStrategy);

export default passport;