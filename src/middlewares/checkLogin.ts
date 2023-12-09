import { catchAsync, ErrorHandler } from "../helpers";
import { User } from "../models";
import { loginValidation } from "../schemas";

// check if login is syntactically correct
// if yes, find the user with such login
// if the user doesn't exist, throw an error
// else paste to the body and continue

const checkLogin = catchAsync(async (req, res, next) => {
  const { error, value } = loginValidation(req.body);
  if (error) {
    throw ErrorHandler(400, error.details[0].message);
  }
  const user = User.findOne({ email: value.email });
  if (error) {
    next(ErrorHandler(400));
  }
  if (!user) {
    next(ErrorHandler(401));
  }

  req.body = value;
  next();
});

export default checkLogin;
