import { catchAsync, ErrorHandler } from "../helpers";
import { User } from "../models";
import { loginValidation } from "../schemas";

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

  // const correctPassword = await user.checkPassword(value.password, user.password)
  req.body = value;
  next();
});

export default checkLogin;
