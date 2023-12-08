import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";
import fs from 'fs';
import { nanoid } from "nanoid";

import {
  catchAsync,
  ErrorHandler,
  sendNodeEmail,
  userAvatar,
} from "../helpers";
import { Comment, User } from "../models";
import { UserType } from "../models/userModel";
import cloudinary from "../helpers/cloudy";

const baseUrl = process.env.BASE_URL;

const register = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  // hashed password
  const salt = 10;
  const hashedPassword = await bcryptjs.hash(req.body.password, salt);

  
  const avatar = userAvatar(email);

  const verificationToken = nanoid();
  // Create a new user
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    birthday: "",
    location: "",
    phone: "",
    avatar: {url: avatar, id: ""},
    password: hashedPassword,
  });

   const verifyEmail = {
     to: req.body.email,
     subject: "Verify email",
     html: `<a target="_blank" href="${baseUrl}/users/verify/${user.verificationToken}">Click me to verify email</a>`,
   };

   await sendNodeEmail(verifyEmail);

  res.status(200).json(user);
});

const login = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "Not Found" });
  }
  const { SECRET_KEY } = process.env;
  const payload = {
    id: user?._id,
  };
  const token = jwt.sign(payload, SECRET_KEY as string, { expiresIn: "5d" });

  user.token = token;

  user.save();

  res
    .status(200)
    .json({
      token,
      user: {
        username: user.username,
        email: user.email,
        location: user.location,
        birthday: user.birthday,
        phone: user.phone,
        userId: user._id,
        favorite: user.favorite,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
      },
    });
});

const logout = catchAsync(async (req, res: Response) => {
  const { _id } = req.user as UserType;
  const user = await User.findByIdAndUpdate(_id, { token: "" });
  if (!user) {
    throw ErrorHandler(401);
  }
  res.status(204).json({message: "Deleted successfully"});
});


const current = catchAsync(async (req, res: Response) => {
  const { user } = req;
  const {
    token,
    username,
    email,
    location,
    birthday,
    phone,
    favorite,
    isAdmin,
    avatar,
    _id: userId,
  } = user as UserType;
  res.json({ token, user: { username, email, location, birthday, phone, userId, favorite, isAdmin, avatar } });
});

const google = catchAsync(async (req: Request, res: Response) => {
  const { _id: userId, email, token, username, avatar, location, birthday, phone } = req.user as UserType;

  res.redirect(
    `http://localhost:3000?token=${token}&email=${email}&userId=${userId}&username=${username}&url=${avatar.url}&avatarId=${avatar.id}&location=${location}&birthday=${birthday}&phone=${phone}`
  );
});

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

const updateInfo = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { avatar, token } = req.user as UserType;
  const { username, email, location, birthday, phone } = req.body;
  if (!req.file) {
    const user = await User.findByIdAndUpdate(userId, {username, 
      email, location, birthday, phone, avatar
    }, {new: true})
    if (!user) {
      throw ErrorHandler(404, "User not found.");
    }
    const comments = await Comment.updateMany(
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
        isAdmin: user?.isAdmin,
        avatar: user?.avatar,
    });
  } else {
    const userOld = await User.findById(userId);
    if (!userOld) {
      throw ErrorHandler(404, "User not found.");
    }
    if (userOld.avatar.id) {
      await cloudinary.uploader.destroy(userOld.avatar.id)
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${nanoid()}`,
      folder: "users",
      width: 40,
      height: 40,
      crop: 'fill'
    });
    console.log(req.file.path)
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
    const comments = await Comment.updateMany(
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
      isAdmin: user?.isAdmin,
      avatar: user?.avatar,
    });
  }
})

export default {
  register,
  login,
  logout,
  current,
  google,
  verifyEmail,
  repeatVerifyEmail,
  updateInfo
};
