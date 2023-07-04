import { Request, Response, NextFunction, RequestHandler } from "express";
import { catchAsync, ErrorHandler } from "../helpers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models";
import { UserType } from "../models/userModel";

export interface AuthenticatedRequest extends Request {
  user?: UserType;
  token?: string;
}

type RequestHandlerWithUser<T = AuthenticatedRequest> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<void>;

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization ?? "";
  const secret = process.env.SECRET_KEY;

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(ErrorHandler(401));
  }
  try {
    const { id } = jwt.verify(token, secret as string) as JwtPayload;
    if (!id) {
      const { userId: id } = jwt.verify(token, secret as string) as JwtPayload;
      if (!id) {
        throw ErrorHandler(401);
      }
      const user = await User.findById(id);
      if (!user || !user.token || user.token !== token) {
        throw ErrorHandler(401);
      }
      req.user = user;
      return next();
    }
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      throw ErrorHandler(401);
    }
    req.user = user;
    next();
  } catch (error) {
    next(ErrorHandler(401));
  }
};

export default authenticate;
