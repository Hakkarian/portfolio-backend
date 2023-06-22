import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../helpers";
// import { AuthenticatedRequest } from "../middlewares/authenticate";
import { Comment } from "../models";
import { UserType } from "../models/userModel";
import { AuthenticatedRequest } from "../middlewares/authenticate";
// import { UserType } from "../models/userModel";


const getAllComments = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const comments = await Comment.find({projectId});

    res.status(200).json(comments);
});


const addComment = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { _id, username, email, avatar } = req.user as UserType;
  const userId = _id;

    const { content } = req.body;
  const comment = await Comment.create({
    projectId,
    content,
    author: { username, email, avatar, userId },
  });
    res.status(201).json(comment);
  };

const updateComment = catchAsync(async (req, res) => {
    const { commentId } = req.params;
  const { content } = req.body;
  const comment = await Comment.findByIdAndUpdate(commentId, req.body, {new: true});
  res.status(201).json(comment);
});

const deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findByIdAndDelete(commentId);
  res.status(201).json({message: "Comment has been deleted succesfully"});
});

export default { getAllComments, addComment, updateComment, deleteComment };