import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../helpers";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../models";
import { UserType } from "../models/userModel";
import { TokenService } from "../service";

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
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ErrorHandler(401, "One error"));
    }
    const accessToken = req.headers.authorization?.split(' ')[1]!;
    console.log('auth accessToken', accessToken);
    if (!accessToken) {
      return next(ErrorHandler(401, "Two error"));
    }
    const userData = TokenService.validateAccessToken(accessToken);
    console.log('auth userdata', userData);
    if (!userData) {
      console.log("last access verification is wrong");
      throw ErrorHandler(401, "Three error");
    }

    req.user = userData;
    next();
  } catch (error) {
    next(ErrorHandler(401, "Some eheherror"));
  }
};

export default authenticate;
