import { Request, Response, NextFunction } from "express";
import { catchAsync, ErrorHandler } from "../helpers";
import { User } from "../models";
import { registerValidation } from "../schemas";

const checkRegister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = registerValidation(req.body);
    if (error) {
      next(ErrorHandler(400, error.message));
    }
    const emailExists = await User.exists({ email: req.body.email });
    if (emailExists) {
      next(ErrorHandler(409, "Email in use"));
    }
    req.body = value;
    next();
  }
);

export default checkRegister;
