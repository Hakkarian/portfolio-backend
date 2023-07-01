import mongoose, { Document, Schema, Types } from "mongoose";
import bcryptjs from 'bcryptjs';

export interface UserType extends Document {
  _id: string,
  username: string;
  email: string;
  birthday: string;
  location: string;
  phone: string;
  avatar: { url: string, id: string};
  token: string;
  favorite: Types.ObjectId[];
  verify: boolean;
  verificationToken: string;
  isAdmin: boolean;
}

const userSchema = new mongoose.Schema<UserType>(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    birthday: {
      type: String,
    },
    location: {
      type: String,
    },
    phone: {
      type: String,
    },
    avatar: {
      url: {
        type: String,
      },
      id: {
        type: String,
      },
    },
    token: {
      type: String,
      default: "",
    },
    favorite: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);



const User = mongoose.model<UserType>('User', userSchema, 'users')

export default User;