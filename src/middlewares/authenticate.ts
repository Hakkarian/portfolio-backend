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
  console.log('here auth', authorization);
  const secret = process.env.SECRET_KEY;

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    console.log("authenticate error bearer");
    next(ErrorHandler(401));
  }
  try {
    const {userId: id} = jwt.verify(token, secret as string) as JwtPayload;
    if (!id) {
      console.log('id error')
      throw ErrorHandler(401);
    }
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      console.log('authenticate error smth with user')
      throw ErrorHandler(401);
    }
    req.user = user;
    next();
  } catch (error) {
    next(ErrorHandler(401));
  }
};




export default authenticate;
