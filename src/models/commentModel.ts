// comment's blueprint

import mongoose, { Schema, Types } from "mongoose";

interface IComment extends Document {
  projectId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    userId: string,
    username: string,
    email: string,
    location: string,
    phone: string
  };
}

const commentSchema = new Schema<IComment>(
  {
    projectId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    author: {
      username: {
        type: String,
      },
      email: {
        type: String,
      },
      location: {
        type: String
      },
      phone: {
        type: String
      },
      avatar: {
        url: {
          type: String,
        },
        id: {
          type: String,
        },
      },
      userId: {
        type: String,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

const Comment = mongoose.model<IComment>('Comment', commentSchema, 'comments')

export default Comment;