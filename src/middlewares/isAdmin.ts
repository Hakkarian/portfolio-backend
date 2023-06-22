import { NextFunction, Request, Response } from "express";
import { ErrorHandler, catchAsync } from "../helpers";
import { UserType } from "../models/userModel";

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { isAdmin } = req.user as UserType;
        if (!isAdmin) {
          throw ErrorHandler(403, "For administrator only.");
        }
        next();
    } catch (error) {
        next(error)
    }
}

export default isAdmin;