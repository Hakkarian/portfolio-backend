import { NextFunction, Response, Request } from "express";
import { ErrorHandler, catchAsync } from "../helpers";
import { userValidation } from "../schemas";

const checkUser = catchAsync((req: Request, res: Response, next: NextFunction) => {
    const { error, value } = userValidation(req.body);
    if (error) {
        next(ErrorHandler(400, error.message))
    }
    req.body = value;
    next();
})

export default checkUser;