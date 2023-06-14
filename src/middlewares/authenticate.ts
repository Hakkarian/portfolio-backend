import { Request, Response, NextFunction, RequestHandler } from "express";
import { catchAsync, errorHandler } from "../helpers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models";
import { UserType } from "../models/userModel";

export interface AuthenticatedRequest extends Request {
    user?: UserType,
    token?: string
}

type RequestHandlerWithUser<T = AuthenticatedRequest> = (
    req: T,
    res: Response,
    next: NextFunction
 ) => Promise<void>;

const authenticate: RequestHandlerWithUser<AuthenticatedRequest> = catchAsync(async (req, res, next) => { 
    const authorization = req.headers.authorization ?? '';
    const secret = process.env.SECRET_KEY;

    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') {
        next(errorHandler(401))
    }
    
    try {
        const {id} = jwt.verify(token, secret as string) as JwtPayload;
        const user = await User.findById(id);
        if (!user || !user.token || user.token !== token) {
            throw errorHandler(401)
        }
        req.user = user;
        next();
    } catch (error) {
        next(error)
    }

})

const authenticateHandler: RequestHandler = (req, res, next) => {
    return authenticate(req as AuthenticatedRequest, res, next).catch(next)
}

export default authenticateHandler;
