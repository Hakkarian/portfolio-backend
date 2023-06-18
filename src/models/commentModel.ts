import mongoose, { Schema, Types} from "mongoose";

interface IComment extends Document {
  projectId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    userId: string,
    username: string,
    email: string
  };
}

const commentSchema = new Schema<IComment>(
  {
    projectId: {
      type: String,
      required: true
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
      avatar: {
        type: String
      },
      email: {
        type: String,
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