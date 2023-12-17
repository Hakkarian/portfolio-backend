import { Request, Response, NextFunction, RequestHandler } from "express";
import { catchAsync, ErrorHandler, validateRefreshToken } from "../helpers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models";
import { UserType } from "../models/userModel";

// the most important part overall

// creating a model with authenticated request
export interface AuthenticatedRequest extends Request {
  user?: UserType;
  token?: string;
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check for authorization token
  const authorization = req.headers.authorization ?? "";

  // split the token into two parts - bearer and token
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(ErrorHandler(401));
  }
  try {
    const { refreshToken } = req.cookies;
    const vfiedRefresh = validateRefreshToken(refreshToken);
    if (!vfiedRefresh) {
      console.log("lest refresh verification is wrong");
      throw ErrorHandler(401);
    }
    // if the token is correct, find user by this id
    // if user undefined, if user's token isn't there or does not equal to token which is passed - throw an error
    const user = await User.findById((vfiedRefresh as JwtPayload)?.id);
    console.log('refresh user contents', user);
    // else user is passed into the slot, continue
    req.user = user!;
    next();
  } catch (error) {
    next(ErrorHandler(401));
  }
};

export default authenticate;
