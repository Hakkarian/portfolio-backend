import { Request, Response, NextFunction, RequestHandler } from "express";
import { catchAsync, ErrorHandler } from "../helpers";
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
  const secret = process.env.SECRET_KEY;

  // split the token into two parts - bearer and token
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(ErrorHandler(401));
  }
  try {
    // verify if token is correct
    // if not, throw an error
    const { userId: id } = jwt.verify(token, secret as string) as JwtPayload;
    if (!id) {
      throw ErrorHandler(401);
    }
    // if the token is correct, find user by this id
    // if user undefined, if user's token isn't there or does not equal to token which is passed - throw an error
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      throw ErrorHandler(401);
    }
    // else user is passed into the slot, continue
    req.user = user;
    next();
  } catch (error) {
    next(ErrorHandler(401));
  }
};

export default authenticate;
