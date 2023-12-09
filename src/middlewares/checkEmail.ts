import { catchAsync, ErrorHandler } from "../helpers";
import { User } from "../models";
import { emailValidation } from "../schemas";

// check if email is syntactically correct
// if yes, find the user with such email
// if the user doesn't exist, throw an error
// else paste to the body and continue

const checkEmail = catchAsync(async (req, res, next) => {
  const { error, value } = emailValidation(req.body);

  if (error) {
    throw ErrorHandler(400, error.details[0].message);
  }
  const user = await User.findOne({ email: value.email });
  if (!user) {
    throw ErrorHandler(401);
  }
  req.body = value;
  next();
});

export default checkEmail;
