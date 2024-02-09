import { Request, Response } from "express";
import fs from "fs";
import { nanoid } from "nanoid";

import {
  catchAsync,
  ErrorHandler,
  sendNodeEmail
} from "../helpers";
import { Comment, User } from "../models";
import { UserType } from "../models/userModel";
import cloudinary from "../helpers/cloudy";
import { UserService } from "../service";

// create a user with default avatar and credentials
const register = catchAsync(async (req: Request, res: Response) => {
  console.log('0')
  const { username, email, password } = req.body;
  console.log('1')
  // hashed password
  const salt = 10;
  // Create a new user
  console.log('2')
  const userData = await UserService.registration(username, email, password, salt);
  console.log('3')
  res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, maxAge: 15 * 24 * 60 * 60 * 1000 });
  res.status(200).json(userData);
});
// user must login after registration. If such user is not present, throw an error, save them to database, and add them a token
const login = catchAsync(async (req: Request, res: Response) => {
  console.log('login')
  const { email, password } = req.body;
  console.log('email')
  const userData = await UserService.login(email, password);
  console.log('yea', userData)
  res.cookie("refreshToken", userData.refreshToken, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
  res.status(200).json(userData);
});
// on logout user's token is removed from database.
const logout = catchAsync(async (req, res: Response) => {

  const { refreshToken } = req.cookies;
  const token = UserService.logout(refreshToken);

  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Deleted successfully", token});
});

// user will be constantly saved between reloads



const refresh = catchAsync(async (req: Request, res: Response) => {
  console.log('do you see me?')
  const { refreshToken } = req.cookies;
  const userData = await UserService.refresh(refreshToken);
  console.log('refresh data', userData)
  res.status(200).json(userData)
})

// google authentication. All credentials were passed via the link
const google = catchAsync(async (req: Request, res: Response) => {
  const {
    _id: userId,
    email,
    token,
    username,
    avatar,
    location,
    birthday,
    phone,
  } = req.user as UserType;

  res.redirect(
    `http://localhost:3000?token=${token}&email=${email}&userId=${userId}&username=${username}&url=${avatar.url}&avatarId=${avatar.id}&location=${location}&birthday=${birthday}&phone=${phone}`
  );
});

// find a user ith verification Token. If such isn't there, throw an error
// else succesfully verified
const verifyEmail = catchAsync(async (req, res: Response) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw ErrorHandler(404, "Email not found");
  }
  await User.findByIdAndUpdate(user?._id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).json({ message: "Verification successful" });
});

// if somehow user is not able to see email verification, it is repeated
// if user is already verified, throw an error
const repeatVerifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const baseUrl = process.env.BASE_URL;
  const user = await User.findOne({ email });

  if (!user) {
    throw ErrorHandler(401, "Email not found");
  }
  if (user.verify) {
    throw ErrorHandler(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${baseUrl}/users/verify/${user.verificationToken}">Click me to verify email</a>`,
  };

  await sendNodeEmail(verifyEmail);

  res.json({ message: "Email verification success" });
});

// update the information about user, his credentials and photo
const updateInfo = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { avatar, token } = req.user as UserType;
  const { username, email, location, birthday, phone } = req.body;
  if (!req.file) {
    const user = await User.findByIdAndUpdate(
      userId,
      { username, email, location, birthday, phone, avatar },
      { new: true }
    );
    if (!user) {
      throw ErrorHandler(404, "User not found.");
    }
    // updates not only user's credentials, but also information inside of the comment
    await Comment.updateMany(
      { "author.userId": userId },
      {
        "author.username": username,
        "author.location": location,
        "author.email": email,
        "author.phone": phone,
      },
      { new: true }
    );
    return res.status(200).json({
      username: user?.username,
      email: user?.email,
      location: user?.location,
      birthday: user?.birthday,
      phone: user?.phone,
      userId: user?._id,
      favorite: user?.favorite,
      avatar: user?.avatar,
    });
  } else {
    const userOld = await User.findById(userId);
    if (!userOld) {
      throw ErrorHandler(404, "User not found.");
    }
    if (userOld.avatar.id) {
      await cloudinary.uploader.destroy(userOld.avatar.id);
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${nanoid()}`,
      folder: "users",
      width: 40,
      height: 40,
      crop: "fill",
      gravity: "auto",
    });
    console.log(req.file.path);
    fs.unlink(req.file.path, (error) => console.log(error));

    const avatar = { url: result.secure_url, id: result.public_id };
    const user = await User.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        birthday,
        location,
        phone,
        avatar,
      },
      { new: true }
    );
    // updates with avatar
    await Comment.updateMany(
      { "author.userId": userId },
      {
        "author.username": username,
        "author.location": location,
        "author.email": email,
        "author.phone": phone,
        "author.avatar.url": result.secure_url,
        "author.avatar.id": result.public_id,
      },
      { new: true }
    );
    return res.status(200).json({
      username: user?.username,
      email: user?.email,
      location: user?.location,
      birthday: user?.birthday,
      phone: user?.phone,
      userId: user?._id,
      favorite: user?.favorite,
      avatar: user?.avatar,
    });
  }
});

export default {
  register,
  login,
  logout,
  refresh,
  google,
  verifyEmail,
  repeatVerifyEmail,
  updateInfo,
};
