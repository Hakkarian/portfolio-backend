import { catchAsync, errorHandler } from "../helpers";
import { User } from "../models";
import { emailValidation } from "../schemas";

const checkEmail = catchAsync(async (req, res, next) => {
    const { error, value } = emailValidation(req.body);

    if (error) {
        throw errorHandler(400, error.details[0].message);
    }
    const user = await User.findOne({ email: value.email })
    if (!user) {
        throw errorHandler(401)
    }
    req.body = value;
    next()
})

export default checkEmail;