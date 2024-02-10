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
    const authorizationHeader = req.headers.authorization as string;
    if (!authorizationHeader) {
      return next(ErrorHandler(401, "One error"));
    }
    const accessToken = authorizationHeader.split(' ')[1]!;
    if (!accessToken) {
      return next(ErrorHandler(404, "Two error"));
    }
    const userData = TokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ErrorHandler(401, "Token expired"));
    }
    req.user = userData;
    next();
  } catch (error) {
    next(error)
  }
};

export default authenticate;
